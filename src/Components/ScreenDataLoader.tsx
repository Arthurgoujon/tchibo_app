import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {makeThemedStyles} from '~/features/theme/theme';
import {MonButton} from './Button/MonButton';

export interface ScreenDataLoaderProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  onRetryPress?: () => Promise<void>;
}

export const ScreenDataLoader: React.FC<ScreenDataLoaderProps> = (props) => {
  const st = useStyles();
  const retry = async () => {
    try {
      if (props.onRetryPress) {
        await Promise.resolve(props.onRetryPress());
      }
    } catch (err) {}
  };

  if (props.isLoading) {
    return (
      <View style={st.screen}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  if (props.hasError) {
    return (
      <View style={st.screen}>
        <View style={st.error}>
          <Text style={st.errorText}>{props.errorMessage}</Text>
          <MonButton
            style={st.retryBtn}
            text="Try again"
            onActionPress={retry}
          />
        </View>
      </View>
    );
  }

  return null;
};

const useStyles = makeThemedStyles((theme) => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtn: {
    ...theme.primaryBtnStyle,
  },
  error: {
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 20,
  },
}));
