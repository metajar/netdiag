import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface MTROptions {
  packetCount: number;
  packetSize: number;
  interval: number;
}

interface MTRResult {
  hop: number;
  host: string;
  loss: number;
  snt: number;
  last: number;
  avg: number;
  best: number;
  wrst: number;
  stdev: number;
}

async function parseMTROutput(output: string): Promise<MTRResult[]> {
  const lines = output.split('\n').filter(line => line.trim());
  const results: MTRResult[] = [];
  
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ip, options } = await req.json();
    
    if (!ip) {
      return new Response(
        JSON.stringify({ error: "IP address is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Handle IPv6 addresses by wrapping them in square brackets
    const formattedIP = ip.includes(':') ? `[${ip}]` : ip;
    const mtrCommand = `mtr -n -j -c ${options.packetCount} -s ${options.packetSize} -i ${options.interval} ${formattedIP}`;
    const { stdout, stderr } = await execAsync(mtrCommand);

    if (stderr) {
      throw new Error(stderr);
    }

    const results = await parseMTROutput(stdout);

    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});