import React, { ReactNode } from 'react';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className={`py-4 text-center text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        © {new Date().getFullYear()} Network Diagnostics Tool
      </footer>
    </div>
  );
};

export default Layout;