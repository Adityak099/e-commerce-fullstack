// src/components/ThemeProvider.js
'use client';
import { useEffect, useState } from 'react';

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem('theme') === 'dark';
};

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((currentMode) => !currentMode);
  };

  return (
    <>
      <button 
        onClick={toggleTheme}
        className="fixed bottom-5 right-5 z-50 rounded-full border border-slate-300 bg-white/95 px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100 dark:hover:bg-slate-800"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {children}
    </>
  );
}
