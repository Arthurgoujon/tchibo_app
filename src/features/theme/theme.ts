import {useContext} from 'react';
import {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import {MonkadoTheme} from './MonkadoTheme';
import {MonkadoThemeContextInstance} from './MonkadoThemeProvider';

// Hook to use themeContext
export const useTheme = () => {
  const janusCtx = useContext(MonkadoThemeContextInstance);
  if (!janusCtx) {
    throw new Error("Can't find theme provider, missing provider ?");
  }
  return janusCtx;
};

// This function wraps function which returns styles and  provides theme
type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle | {}};
export const makeThemedStyles = <
  T extends NamedStyles<T> | NamedStyles<any>,
  K extends {} = {}
>(
  themeFunc: (theme: MonkadoTheme, props: K) => T,
) => {
  const useStyles = (props?: K) => {
    const theme = useTheme();

    const passDownProps = props || ({} as K);
    // Call wrapped function
    return themeFunc(theme.current, passDownProps);
  };

  return useStyles;
};
