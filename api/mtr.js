import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

async function parseMTROutput(output) {
  const lines = output.split('\n').filter(line => line.trim());
  const results = [];
  
  // Skip the header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(/\s+/);
    if (parts.length < 10) continue;
    
    results.push({
      hop: parseInt(parts[0]),
      host: parts[1],
      loss: parseFloat(parts[2]),
      snt: parseInt(parts[3]),
      last: parseFloat(parts[4]),
      avg: parseFloat(parts[5]),
      best: parseFloat(parts[6]),
      wrst: parseFloat(parts[7]),
      stdev: parseFloat(parts[8])
    });
  }
  
  return results;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ip, options } = req.body;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    // Run MTR command
    const mtrCommand = `mtr -n -r -c ${options.packetCount} -s ${options.packetSize} -i ${options.interval} ${ip}`;
    const { stdout, stderr } = await execAsync(mtrCommand);

    if (stderr) {
      throw new Error(stderr);
    }

    const mtrResults = await parseMTROutput(stdout);

    // Create test result object
    const testResult = {
      ip: ip,
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substring(2, 15),
      hops: mtrResults.map(hop => ({
        ip: hop.host,
        latency: hop.avg,
        packetLoss: hop.loss,
        jitter: hop.stdev,
        packetCount: hop.snt
      })),
      summary: {
        avgLatency: mtrResults.reduce((sum, hop) => sum + hop.avg, 0) / mtrResults.length,
        minLatency: Math.min(...mtrResults.map(hop => hop.best)),
        maxLatency: Math.max(...mtrResults.map(hop => hop.wrst)),
        stdDevLatency: mtrResults.reduce((sum, hop) => sum + hop.stdev, 0) / mtrResults.length,
        packetLoss: mtrResults.reduce((sum, hop) => sum + hop.loss, 0) / mtrResults.length,
        jitter: mtrResults.reduce((sum, hop) => sum + hop.stdev, 0) / mtrResults.length,
        packetsSent: options.packetCount * mtrResults.length,
        packetsReceived: options.packetCount * mtrResults.length * (1 - (mtrResults.reduce((sum, hop) => sum + hop.loss, 0) / (100 * mtrResults.length))),
        testDuration: options.interval * options.packetCount
      }
    };

    // Save test results to file
    const resultsDir = join(process.cwd(), 'data');
    const resultsFile = join(resultsDir, `${testResult.testId}.json`);
    await writeFile(resultsFile, JSON.stringify(testResult, null, 2));

    res.status(200).json(testResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}