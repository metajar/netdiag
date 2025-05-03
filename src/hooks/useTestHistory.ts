import { useState, useEffect } from 'react';
import { TestResult } from '../types';

const HISTORY_KEY = 'network-test-history';
const MAX_HISTORY_ITEMS = 10;

export function useTestHistory() {
  const [history, setHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (result: TestResult) => {
    const newHistory = [result, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return {
    history,
    addToHistory,
    clearHistory
  };
}