import { useState } from 'react';
import { TestOptions, TestResult } from '../types';
import { isValidIPv4, isValidIPv6 } from '../utils/ipValidation';

export function useNetworkTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const startTest = async (ipAddress: string, options: TestOptions) => {
    setError(null);
    setProgress(0);
    setIsRunning(true);
    setTestResults(null); // Reset previous results
    
    if (!isValidIPv4(ipAddress) && !isValidIPv6(ipAddress)) {
      setError('Invalid IP address. Please enter a valid IPv4 or IPv6 address.');
      setIsRunning(false);
      return;
    }
    
    try {
      // Execute MTR command and parse results
      const response = await fetch('/api/mtr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: ipAddress, options }),
      });

      if (!response.ok) {
        throw new Error('Network test failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTestResults(data);
      setProgress(100);
      return data; // Return the results for the caller
      
    } catch (err) {
      setError(err.message || 'An error occurred during the test. Please try again.');
      return null;
    } finally {
      setIsRunning(false);
    }
  };
  
  return {
    startTest,
    isRunning,
    progress,
    testResults,
    hasResults: testResults !== null,
    error
  };
}