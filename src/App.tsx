import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import DiagnosticDashboard from './components/DiagnosticDashboard';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <DiagnosticDashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;