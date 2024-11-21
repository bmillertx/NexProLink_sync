import React, { createContext, useContext } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={useTheme()}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  
  return {
    isDarkMode: theme === 'dark',
    toggleDarkMode: () => setTheme(theme === 'dark' ? 'light' : 'dark')
  };
}
