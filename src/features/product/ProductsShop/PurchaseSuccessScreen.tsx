import React, {useCallback, useEffect} from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PurchaseSuccessScreenNavigationScreenProp} from '~/navigation';
import {makeThemedStyles} from '~/features/theme/theme';

export const PurchaseSuccessScreen = () => {
  const st = useStyles();
  const navigator = useNavigation<PurchaseSuccessScreenNavigationScreenProp>();

  useEffect(
    useCallback(() => {
      let cancelled = false;

      setTimeout(() => {
        if (cancelled) {
          return;
        }

        navigator.navigate('Home', {
          screen: 'MyProducts',
        });
      }, 2000);

      return () => {
        cancelled = true;
      };
    }, []),
    [],
  );

  return (
    <View style={st.screen}>
      <Text style={st.title}>Thank you !</Text>
    </View>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.headerTitle,
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 34,
  },
}));
