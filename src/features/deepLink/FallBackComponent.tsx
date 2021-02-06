import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Logo from '@svg/logo.svg';

export const FallBackComponent = () => {
  return (
    <View style={st.screen}>
      <Logo height={st.logo.height} width={st.logo.width} />
      <Text style={st.title}>monKado</Text>
    </View>
  );
};

const st = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1D2D50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '50%',
    width: '50%',
  },
  title: {
    marginTop: 30,
    fontFamily: 'RobotoMono-Bold',
    fontSize: 48,
    lineHeight: 63,
    letterSpacing: 3.52,
    color: 'white',
  },
});
