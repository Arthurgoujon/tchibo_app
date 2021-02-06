import React, {createContext, useState} from 'react';
import {MonkadoTheme} from './MonkadoTheme';

export interface ThemeContext {
  current: MonkadoTheme;
}

// Context
const MonkadoThemeContextInstance = createContext<ThemeContext>(
  {} as ThemeContext,
);
const {Provider} = MonkadoThemeContextInstance;

export interface MonkadoThemeProviderProps {
  theme: MonkadoTheme;
}

// Theme provider
const MonkadoThemeProvider: React.FC<MonkadoThemeProviderProps> = ({
  children,
  theme,
}) => {
  const [state] = useState(theme);

  return <Provider value={{current: state}}>{children}</Provider>;
};

export {MonkadoThemeProvider, MonkadoThemeContextInstance};
