import React, { useState } from 'react';
import { Activity, HelpCircle } from 'lucide-react';
import TargetSelector from './TargetSelector';
import TestOptions from './TestOptions';
import MagicButton from './MagicButton';
import TestResults from './TestResults';
import TestHistory from './TestHistory';
import MTRInfoModal from './MTRInfoModal';
import { useNetworkTest } from '../hooks/useNetworkTest';
import { useTestHistory } from '../hooks/useTestHistory';
import { Target } from '../config/targets';

const DiagnosticDashboard: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [testOptions, setTestOptions] = useState({
    packetCount: 10,
    packetSize: 56,
    interval: 1,
  });
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const { 
    startTest, 
    isRunning, 
    progress, 
    testResults, 
    hasResults,
    error 
  } = useNetworkTest();

  const {
    history,
    addToHistory,
    clearHistory
  } = useTestHistory();
  
  const handleStartTest = async () => {
    const results = await startTest(ipAddress, testOptions);
    if (results) {
      addToHistory(results);
    }
  };
  
  const handleOptionChange = (options: typeof testOptions) => {
    setTestOptions(options);
  };

  const handleTargetSelect = (target: Target) => {
    setIpAddress(target.ip);
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Test Configuration</h2>
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                title="Learn about MTR interpretation"
              >
                <HelpCircle className="h-5 w-5 text-blue-400" />
              </button>
            </div>
            
            <TargetSelector 
              value={ipAddress}
              onChange={setIpAddress}
              onTargetSelect={handleTargetSelect}
              disabled={isRunning}
            />
            
            <div className="mt-6">
              <TestOptions 
                options={testOptions}
                onChange={handleOptionChange}
                disabled={isRunning}
              />
            </div>
            
            <div className="mt-6">
              <MagicButton 
                onClick={handleStartTest} 
                isRunning={isRunning} 
                progress={progress}
                disabled={!ipAddress || isRunning}
              />
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <TestHistory history={history} onClear={clearHistory} />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[500px]">
          {hasResults ? (
            <TestResults results={testResults} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Activity className="w-12 h-12 mb-4 text-blue-500 opacity-50" />
              <p className="text-lg">Enter an IP address and click "Magic" to run diagnostics</p>
            </div>
          )}
        </div>
      </div>

      <MTRInfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
};

export default DiagnosticDashboard;