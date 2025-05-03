export interface Hop {
  ip: string;
  hostname?: string;
  latency: number; // in ms
  packetLoss: number; // percentage
  jitter: number; // in ms
  asn?: string; // Autonomous System Number
  packetCount?: number; // number of packets sent to this hop
}

export interface TestSummary {
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  stdDevLatency: number;
  packetLoss: number;
  jitter: number;
  packetsSent: number;
  packetsReceived: number;
  testDuration: number; // in seconds
}

export interface TestResult {
  ip: string;
  timestamp: string;
  testId: string;
  hops: Hop[];
  summary: TestSummary;
  rawOutput?: string;
}

export interface TestOptions {
  packetCount: number;
  packetSize: number;
  interval: number;
}