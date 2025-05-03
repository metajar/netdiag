import React from 'react';
import { TestResult } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Trash2 } from 'lucide-react';

interface TestHistoryProps {
  history: TestResult[];
  onClear: () => void;
}

const TestHistory: React.FC<TestHistoryProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No test history available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Tests</h3>
        <button
          onClick={onClear}
          className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-2">
        {history.map((test) => (
          <div
            key={test.testId}
            className="bg-gray-700 rounded-md p-3 hover:bg-gray-600 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{test.ip}</p>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(test.timestamp))} ago
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <span className="text-gray-400">Latency:</span>{' '}
                  <span className={`font-medium ${
                    test.summary.avgLatency > 100 ? 'text-red-400' :
                    test.summary.avgLatency > 50 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {test.summary.avgLatency}ms
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Loss:</span>{' '}
                  <span className={`font-medium ${
                    test.summary.packetLoss > 5 ? 'text-red-400' :
                    test.summary.packetLoss > 0 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {test.summary.packetLoss}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestHistory;