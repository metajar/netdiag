import { Hop, TestResult, TestSummary, TestOptions } from '../types';

// Generate realistic-looking network path data
export function generateMockHops(ipAddress: string, options: TestOptions): Hop[] {
  const hopCount = Math.floor(Math.random() * 8) + 5; // 5-12 hops
  const hops: Hop[] = [];
  
  // Common network prefixes for realistic paths
  const networkPrefixes = [
    '10.0.0', '172.16.0', '192.168.0', // Private networks
    '64.233.160', '172.217.0', '8.8.8', // Google
    '104.244.42', '199.59.148', // Twitter
    '31.13.24', '157.240.0', // Facebook
    '52.95.0', '54.239.0' // AWS
  ];
  
  // Common hostnames for realistic paths
  const hostnameParts = [
    ['router', 'gateway', 'core', 'edge', 'border'],
    ['east', 'west', 'north', 'south', 'central'],
    ['1', '2', '3', '4', '5'],
    ['.isp.net', '.backbone.net', '.core.net', '.transit.net', '.cdn.net']
  ];
  
  // Autonomous System Numbers (ASNs) for common networks
  const asns = [
    'AS7922 (Comcast)', 'AS3356 (Level 3)', 'AS1299 (Telia)', 
    'AS2914 (NTT)', 'AS174 (Cogent)', 'AS6939 (Hurricane Electric)',
    'AS16509 (Amazon)', 'AS15169 (Google)', 'AS32934 (Facebook)'
  ];
  
  // Generate latency model with increasing values
  let baseLatency = Math.random() * 5 + 2; // Start with 2-7ms
  
  for (let i = 0; i < hopCount; i++) {
    // Generate realistic IP
    const prefixIdx = Math.floor(Math.random() * networkPrefixes.length);
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    const ip = i === hopCount - 1 
      ? ipAddress 
      : `${networkPrefixes[prefixIdx]}.${lastOctet}`;
    
    // Hostname (sometimes empty to simulate timeouts or security policies)
    let hostname: string | undefined = undefined;
    if (Math.random() > 0.3) { // 70% chance of having hostname
      hostname = [
        hostnameParts[0][Math.floor(Math.random() * hostnameParts[0].length)],
        hostnameParts[1][Math.floor(Math.random() * hostnameParts[1].length)],
        hostnameParts[2][Math.floor(Math.random() * hostnameParts[2].length)],
        hostnameParts[3][Math.floor(Math.random() * hostnameParts[3].length)]
      ].join('-');
    }
    
    // Latency increases as we go further in the path
    baseLatency += Math.random() * 10 + 5;
    // Sometimes add a significant jump to simulate crossing oceans or networks
    if (Math.random() > 0.8) {
      baseLatency += Math.random() * 40 + 20;
    }
    
    // Packet loss (mostly low but occasional spikes)
    const packetLoss = Math.random() > 0.8 
      ? Math.random() * 15 // Occasional higher loss
      : Math.random() * 2; // Usually low loss
    
    // Jitter (variation in latency)
    const jitter = Math.random() * 15 + 1;
    
    // ASN (optional)
    const asn = Math.random() > 0.5 
      ? asns[Math.floor(Math.random() * asns.length)]
      : undefined;
    
    hops.push({
      ip,
      hostname,
      latency: Math.round(baseLatency * 10) / 10, // Round to 1 decimal place
      packetLoss: Math.round(packetLoss * 10) / 10,
      jitter: Math.round(jitter * 10) / 10,
      asn,
      packetCount: options.packetCount // Add packet count to each hop
    });
  }
  
  return hops;
}

// Generate comprehensive test summary
export function generateTestSummary(hops: Hop[], options: TestOptions): TestSummary {
  const latencies = hops.map(hop => hop.latency);
  const avgLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);
  
  // Calculate standard deviation
  const variance = latencies.reduce((sum, lat) => sum + Math.pow(lat - avgLatency, 2), 0) / latencies.length;
  const stdDevLatency = Math.sqrt(variance);
  
  // Calculate overall packet loss
  const packetLoss = hops.reduce((sum, hop) => sum + hop.packetLoss, 0) / hops.length;
  
  // Calculate average jitter
  const jitter = hops.reduce((sum, hop) => sum + hop.jitter, 0) / hops.length;
  
  // Packets sent/received based on options and loss
  const packetsSent = options.packetCount * hops.length;
  const packetsLost = Math.round(packetsSent * (packetLoss / 100));
  const packetsReceived = packetsSent - packetsLost;
  
  // Test duration based on options
  const testDuration = options.interval * options.packetCount;
  
  return {
    avgLatency: Math.round(avgLatency * 10) / 10,
    minLatency: Math.round(minLatency * 10) / 10,
    maxLatency: Math.round(maxLatency * 10) / 10,
    stdDevLatency: Math.round(stdDevLatency * 10) / 10,
    packetLoss: Math.round(packetLoss * 10) / 10,
    jitter: Math.round(jitter * 10) / 10,
    packetsSent,
    packetsReceived,
    testDuration: Math.round(testDuration * 10) / 10
  };
}

// Generate a complete test result
export function generateTestResult(ipAddress: string, options: TestOptions): TestResult {
  const hops = generateMockHops(ipAddress, options);
  const summary = generateTestSummary(hops, options);
  
  return {
    ip: ipAddress,
    timestamp: new Date().toISOString(),
    testId: Math.random().toString(36).substring(2, 15),
    hops,
    summary
  };
}