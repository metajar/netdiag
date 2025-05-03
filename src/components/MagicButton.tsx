import React from 'react';
import { Wand2 } from 'lucide-react';

interface MagicButtonProps {
  onClick: () => void;
  isRunning: boolean;
  progress: number;
  disabled?: boolean;
}

const MagicButton: React.FC<MagicButtonProps> = ({
  onClick,
  isRunning,
  progress,
  disabled = false
}) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full py-3 px-6 flex items-center justify-center space-x-2 
          rounded-md text-white font-medium transition-all duration-300
          shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
        `}
      >
        <Wand2 className={`h-5 w-5 ${isRunning ? 'animate-pulse' : ''}`} />
        <span>{isRunning ? 'Running Diagnostics...' : 'Magic'}</span>
      </button>
      
      {isRunning && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700 rounded-b-md overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-300 rounded-b-md"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MagicButton;