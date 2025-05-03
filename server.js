import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import cors from 'cors';
import dns from 'dns';
import net from 'net';

const execAsync = promisify(exec);
const dnsResolve = promisify(dns.resolve);
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

async function lookupASN(ip) {
  return new Promise((resolve) => {
    const client = new net.Socket();
    const reverseIP = ip.split('.').reverse().join('.');
    let data = '';

    client.connect(43, 'whois.cymru.com', () => {
      client.write(`begin\nverbose\n${ip}\nend\n`);
    });

    client.on('data', (chunk) => {
      data += chunk;
    });

    client.on('end', () => {
      const lines = data.split('\n');
      for (const line of lines) {
        if (line.includes('|')) {
          const parts = line.split('|').map(part => part.trim());
          if (parts.length >= 3 && parts[0] !== 'NA') {
            resolve({
              asn: `AS${parts[0]}`,
              name: parts[2]
            });
            return;
          }
        }
      }
      resolve(null);
    });

    client.on('error', () => {
      resolve(null);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      client.destroy();
      resolve(null);
    }, 5000);
  });
}

async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir);
  }
  return dataDir;
}

async function parseMTROutput(output) {
  console.log('Raw MTR output:', output);
  
  const lines = output.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('Start:') && !line.startsWith('HOST:'));
  
  console.log('Filtered lines:', lines);
  
  const results = [];
  
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\.\|--\s+([^\s]+)\s+(\d+\.?\d*%?)\s+(\d+)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)/);
    
    if (match) {
      const [_, hopNum, host, lossStr, sent, last, avg, best, worst, stddev] = match;
      const loss = parseFloat(lossStr.replace('%', ''));
      
      // Only lookup ASN for valid IPs (not "???" or other placeholders)
      let asnInfo = null;
      if (host !== '???' && net.isIP(host)) {
        asnInfo = await lookupASN(host);
      }
      
      results.push({
        hop: parseInt(hopNum),
        host: host === '???' ? 'Unknown' : host,
        loss: loss,
        snt: parseInt(sent),
        last: parseFloat(last),
        avg: parseFloat(avg),
        best: parseFloat(best),
        wrst: parseFloat(worst),
        stdev: parseFloat(stddev),
        asn: asnInfo?.asn || null,
        asnName: asnInfo?.name || null
      });
      
      console.log('Parsed hop:', results[results.length - 1]);
    } else {
      console.log('Line did not match pattern:', line);
    }
  }
  
  if (results.length === 0) {
    throw new Error('Failed to parse MTR output. No valid results found.');
  }
  
  return results;
}

app.post('/api/mtr', async (req, res) => {
  try {
    const { ip, options } = req.body;
    console.log('Received request:', { ip, options });
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    // Determine if IPv6 and construct appropriate command
    const isIPv6 = ip.includes(':');
    const mtrCommand = `sudo mtr ${isIPv6 ? '-6' : ''} --no-dns -r -c ${options.packetCount} -s ${options.packetSize} -i ${options.interval} ${ip}`;
    const mtrRawCommand = `sudo mtr ${isIPv6 ? '-6' : ''} --no-dns -r -c ${options.packetCount} -s ${options.packetSize} -i ${options.interval} ${ip}`;
    
    console.log('Executing command:', mtrCommand);
    
    const [parsedOutput, rawOutput] = await Promise.all([
      execAsync(mtrCommand),
      execAsync(mtrRawCommand)
    ]);
    
    if (parsedOutput.stderr) {
      console.error('MTR stderr:', parsedOutput.stderr);
      throw new Error(`MTR error: ${parsedOutput.stderr}`);
    }

    const mtrResults = await parseMTROutput(parsedOutput.stdout);
    console.log('Parsed results:', mtrResults);

    const testResult = {
      ip: ip,
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substring(2, 15),
      hops: mtrResults.map(hop => ({
        ip: hop.host,
        latency: parseFloat(hop.avg.toFixed(2)),
        packetLoss: parseFloat(hop.loss.toFixed(2)),
        jitter: parseFloat(hop.stdev.toFixed(2)),
        packetCount: hop.snt,
        ...(hop.asn && { asn: hop.asn }),
        ...(hop.asnName && { asnName: hop.asnName })
      })),
      summary: {
        avgLatency: parseFloat((mtrResults.reduce((sum, hop) => sum + hop.avg, 0) / mtrResults.length).toFixed(2)),
        minLatency: parseFloat(Math.min(...mtrResults.map(hop => hop.best)).toFixed(2)),
        maxLatency: parseFloat(Math.max(...mtrResults.map(hop => hop.wrst)).toFixed(2)),
        stdDevLatency: parseFloat((mtrResults.reduce((sum, hop) => sum + hop.stdev, 0) / mtrResults.length).toFixed(2)),
        packetLoss: parseFloat((mtrResults.reduce((sum, hop) => sum + hop.loss, 0) / mtrResults.length).toFixed(2)),
        jitter: parseFloat((mtrResults.reduce((sum, hop) => sum + hop.stdev, 0) / mtrResults.length).toFixed(2)),
        packetsSent: options.packetCount * mtrResults.length,
        packetsReceived: Math.round(options.packetCount * mtrResults.length * (1 - (mtrResults.reduce((sum, hop) => sum + hop.loss, 0) / (100 * mtrResults.length)))),
        testDuration: options.interval * options.packetCount
      },
      rawOutput: rawOutput.stdout
    };

    console.log('Final test result:', testResult);

    const dataDir = await ensureDataDir();
    const resultsFile = join(dataDir, `${testResult.testId}.json`);
    await writeFile(resultsFile, JSON.stringify(testResult, null, 2));

    res.json(testResult);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});