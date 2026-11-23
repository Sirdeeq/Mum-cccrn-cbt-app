import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';
type Theme = 'light' | 'dark';

interface PreferencesContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  theme: Theme;
  toggleTheme: () => void;
  shuffleOptions: boolean;
  setShuffleOptions: (shuffle: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('cccrn_font_size') as FontSize) || 'normal';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('cccrn_theme') as Theme) || 'light';
  });

  const [shuffleOptions, setShuffleOptionsState] = useState<boolean>(() => {
    return localStorage.getItem('cccrn_shuffle_options') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('cccrn_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cccrn_theme', theme);
  }, [theme]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setShuffleOptions = (val: boolean) => {
    setShuffleOptionsState(val);
    localStorage.setItem('cccrn_shuffle_options', val.toString());
  };

  return (
    <PreferencesContext.Provider
      value={{
        fontSize,
        setFontSize,
        theme,
        toggleTheme,
        shuffleOptions,
        setShuffleOptions
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
