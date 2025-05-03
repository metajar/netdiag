import React, { useState, useEffect } from 'react';
import { isValidIPv4, isValidIPv6 } from '../utils/ipValidation';

interface IPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const IPInput: React.FC<IPInputProps> = ({ value, onChange, disabled = false }) => {
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!value) {
      setError(null);
      return;
    }
    
    if (!isValidIPv4(value) && !isValidIPv6(value)) {
      setError('Please enter a valid IP address');
    } else {
      setError(null);
    }
  }, [value]);
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor="ip-address" 
        className="block text-sm font-medium text-gray-300"
      >
        Target IP Address
      </label>
      
      <div className="relative">
        <input
          id="ip-address"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter IP address (e.g., 8.8.8.8)"
          className={`block w-full px-4 py-3 bg-gray-700 border ${
            error ? 'border-red-500' : 'border-gray-600'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-white placeholder-gray-400`}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
        
        {!error && value && (
          <div className="absolute right-3 top-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPInput;