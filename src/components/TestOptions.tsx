import React from 'react';
import { Sliders } from 'lucide-react';

interface TestOptionsProps {
  options: {
    packetCount: number;
    packetSize: number;
    interval: number;
  };
  onChange: (options: TestOptionsProps['options']) => void;
  disabled?: boolean;
}

const TestOptions: React.FC<TestOptionsProps> = ({ 
  options, 
  onChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    
    // Ensure we're working with valid numbers
    if (!isNaN(numericValue)) {
      onChange({
        ...options,
        [name]: numericValue
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sliders className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-medium">Test Options</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Packet Count: {options.packetCount}
          </label>
          <input
            type="range"
            name="packetCount"
            min="1"
            max="100"
            step="1"
            value={options.packetCount}
            onChange={handleChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>100</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Packet Size: {options.packetSize} bytes
          </label>
          <input
            type="range"
            name="packetSize"
            min="32"
            max="1472"
            step="8"
            value={options.packetSize}
            onChange={handleChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>32</span>
            <span>1472</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Interval: {options.interval}s
          </label>
          <input
            type="range"
            name="interval"
            min="0.2"
            max="5"
            step="0.1"
            value={options.interval}
            onChange={handleChange}
            disabled={disabled}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0.2s</span>
            <span>5s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOptions;