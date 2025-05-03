import React from 'react';
import { Hop, TestSummary } from '../types';

interface MetricsDisplayProps {
  hops: Hop[];
  summary: TestSummary;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ hops, summary }) => {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hop
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hostname
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Latency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Loss
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Jitter
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                ASN
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {hops.map((hop, index) => (
              <tr 
                key={index}
                className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {index + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  {hop.ip}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {hop.hostname || '-'}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  hop.latency > 100 ? 'text-red-400' : 
                  hop.latency > 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {hop.latency} ms
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  hop.packetLoss > 5 ? 'text-red-400' : 
                  hop.packetLoss > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {hop.packetLoss}%
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  hop.jitter > 30 ? 'text-red-400' : 
                  hop.jitter > 15 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {hop.jitter} ms
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {hop.asn || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Statistical Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Latency Distribution</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Min</span>
                <span className="font-medium">{summary.minLatency} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Average</span>
                <span className="font-medium">{summary.avgLatency} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max</span>
                <span className="font-medium">{summary.maxLatency} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Standard Deviation</span>
                <span className="font-medium">{summary.stdDevLatency} ms</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Packet Analysis</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Packets Sent</span>
                <span className="font-medium">{summary.packetsSent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Packets Received</span>
                <span className="font-medium">{summary.packetsReceived}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Packet Loss</span>
                <span className={`font-medium ${
                  summary.packetLoss > 5 ? 'text-red-400' : 
                  summary.packetLoss > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}>{summary.packetLoss}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Average Jitter</span>
                <span className="font-medium">{summary.jitter} ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;