import React from 'react';
import { Activity, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={`py-4 px-6 shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold">NetDiag</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;