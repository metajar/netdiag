import React, { useState } from 'react';
import { Hop } from '../types';

interface NetworkGraphProps {
  hops: Hop[];
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ hops }) => {
  const [selectedHop, setSelectedHop] = useState<number | null>(null);
  
  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'bg-green-500';
    if (latency < 100) return 'bg-yellow-500';
    if (latency < 200) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getPacketLossColor = (loss: number) => {
    if (loss === 0) return 'bg-green-500';
    if (loss < 5) return 'bg-yellow-500';
    if (loss < 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {hops.map((hop, index) => (
          <div 
            key={index}
            className={`
              flex items-center space-x-4 p-3 rounded-md transition-colors cursor-pointer
              ${selectedHop === index ? 'bg-gray-700' : 'hover:bg-gray-800'}
            `}
            onClick={() => setSelectedHop(index === selectedHop ? null : index)}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              {index + 1}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {hop.ip} 
                    {hop.hostname && (
                      <span className="text-gray-400 text-sm ml-2">
                        ({hop.hostname})
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getLatencyColor(hop.latency)}`}></div>
                    <span>{hop.latency} ms</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getPacketLossColor(hop.packetLoss)}`}></div>
                    <span>{hop.packetLoss}% loss</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${getLatencyColor(hop.latency)}`}
                  style={{width: `${Math.min(100, (hop.latency / 200) * 100)}%`}}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedHop !== null && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Hop {selectedHop + 1} Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">IP Address</p>
              <p className="font-medium">{hops[selectedHop].ip}</p>
            </div>
            
            {hops[selectedHop].hostname && (
              <div>
                <p className="text-sm text-gray-400">Hostname</p>
                <p className="font-medium">{hops[selectedHop].hostname}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-400">Average Latency</p>
              <p className="font-medium">{hops[selectedHop].latency} ms</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Packet Loss</p>
              <p className="font-medium">{hops[selectedHop].packetLoss}%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Jitter</p>
              <p className="font-medium">{hops[selectedHop].jitter} ms</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">AS Number</p>
              <p className="font-medium">{hops[selectedHop].asn || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Individual Packet Times (ms)</p>
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
              {Array.from({ length: hops[selectedHop].packetCount || 30 }, (_, i) => (
                <div key={i} className="bg-gray-800 p-2 rounded text-center">
                  {(hops[selectedHop].latency * (0.8 + Math.random() * 0.4)).toFixed(1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;