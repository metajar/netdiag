import React, { useState } from 'react';
import NetworkGraph from './NetworkGraph';
import MetricsDisplay from './MetricsDisplay';
import { TestResult } from '../types';
import { FileDown, BarChart2, FileText } from 'lucide-react';

interface TestResultsProps {
  results: TestResult;
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'metrics'>('graph');
  const [showRawOutput, setShowRawOutput] = useState(false);
  
  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `network-test-${results.ip}-${new Date().toISOString()}.json`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const handleExportRaw = () => {
    const rawOutput = results.rawOutput || 'No raw output available';
    const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(rawOutput)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `mtr-${results.ip}-${new Date().toISOString()}.txt`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  // Get the target (last hop) metrics
  const targetHop = results.hops[results.hops.length - 1];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Results for {results.ip}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleExportRaw}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Raw MTR</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <FileDown className="h-4 w-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 flex items-center space-x-1 text-sm font-medium transition-colors ${
              activeTab === 'graph' 
                ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('graph')}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Network Path</span>
          </button>
          
          <button
            className={`px-4 py-2 flex items-center space-x-1 text-sm font-medium transition-colors ${
              activeTab === 'metrics' 
                ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('metrics')}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Detailed Metrics</span>
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === 'graph' ? (
            <NetworkGraph hops={results.hops} />
          ) : (
            <MetricsDisplay 
              hops={results.hops}
              summary={results.summary}
            />
          )}
        </div>
      </div>
      
      <div className="p-4 bg-blue-900/30 border border-blue-800/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Target Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-3 rounded-md">
            <p className="text-gray-400 text-sm">Target Latency</p>
            <p className="text-xl font-semibold">{targetHop.latency} ms</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-md">
            <p className="text-gray-400 text-sm">Target Packet Loss</p>
            <p className="text-xl font-semibold">{targetHop.packetLoss}%</p>
            {targetHop.packetLoss > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {Math.round(results.summary.packetsSent * (targetHop.packetLoss / 100))} packets lost
              </p>
            )}
          </div>
          <div className="bg-gray-800 p-3 rounded-md">
            <p className="text-gray-400 text-sm">Target Jitter</p>
            <p className="text-xl font-semibold">{targetHop.jitter} ms</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-md">
            <p className="text-gray-400 text-sm">Total Hops</p>
            <p className="text-xl font-semibold">{results.hops.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;