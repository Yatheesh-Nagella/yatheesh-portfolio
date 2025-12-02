'use client';

/**
 * Finance Theme Context
 * Manages dark/light mode theme state for finance app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const FinanceThemeContext = createContext<ThemeContextType | null>(null);

export function FinanceThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('finance_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('finance_theme', theme);
    }
  }, [theme, mounted]);

  /**
   * Memoize toggleTheme function to prevent recreation
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <FinanceThemeContext.Provider value={value}>
      {children}
    </FinanceThemeContext.Provider>
  );
}

export function useFinanceTheme() {
  const context = useContext(FinanceThemeContext);
  if (!context) {
    throw new Error('useFinanceTheme must be used within FinanceThemeProvider');
  }
  return context;
}
