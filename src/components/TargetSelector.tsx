import React from 'react';
import { Target, predefinedTargets } from '../config/targets';
import { ChevronDown, Globe, Server } from 'lucide-react';

interface TargetSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onTargetSelect: (target: Target) => void;
  disabled?: boolean;
}

const TargetSelector: React.FC<TargetSelectorProps> = ({
  value,
  onChange,
  onTargetSelect,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCustom, setIsCustom] = React.useState(true);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const target = predefinedTargets.find(t => t.ip === value);
    setIsCustom(!target);
  }, [value]);

  const handleTargetSelect = (target: Target) => {
    onTargetSelect(target);
    setIsOpen(false);
    setIsCustom(false);
  };

  const selectedTarget = predefinedTargets.find(t => t.ip === value);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300">
        Target Selection
      </label>

      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 bg-gray-700 border rounded-md
            ${isOpen ? 'border-blue-500' : 'border-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}
            flex items-center justify-between text-left
          `}
        >
          <div className="flex items-center space-x-2">
            {isCustom ? (
              <>
                <Globe className="h-5 w-5 text-gray-400" />
                <span>Custom Target</span>
              </>
            ) : (
              <>
                <Server className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-medium">{selectedTarget?.name}</div>
                  <div className="text-sm text-gray-400">{selectedTarget?.ip}</div>
                </div>
              </>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              {predefinedTargets.map((target) => (
                <button
                  key={target.ip}
                  onClick={() => handleTargetSelect(target)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors
                    ${target.ip === value ? 'bg-gray-700' : ''}
                    border-b border-gray-700 last:border-b-0
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Server className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{target.name}</div>
                      <div className="text-sm text-gray-400">{target.description}</div>
                      <div className="text-xs text-gray-500">{target.ip}</div>
                    </div>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => {
                  setIsCustom(true);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors
                  ${isCustom ? 'bg-gray-700' : ''}
                  border-t border-gray-700
                `}
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Custom Target</div>
                    <div className="text-sm text-gray-400">Enter a custom IP address</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {isCustom && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter IP address (e.g., 8.8.8.8)"
            className="mt-2 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-white placeholder-gray-400"
          />
        )}
      </div>
    </div>
  );
};

export default TargetSelector;