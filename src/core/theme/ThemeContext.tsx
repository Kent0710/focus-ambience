import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, ThemeColors } from './colors';
import { STORAGE_KEYS } from '../constants/config';
import { hapticEngine } from '../haptics/HapticEngine';

export type ColorMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  colorMode: ColorMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [colorMode, setColorModeState] = useState<ColorMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE).then((saved) => {
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        setColorModeState(saved as ColorMode);
      }
    });
  }, []);

  const isDark = colorMode === 'system' ? systemScheme !== 'light' : colorMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    hapticEngine.tick();
    AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextMode: ColorMode = isDark ? 'light' : 'dark';
    setColorMode(nextMode);
  }, [isDark, setColorMode]);

  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        isDark,
        colors,
        toggleTheme,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
