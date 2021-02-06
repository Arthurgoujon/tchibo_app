import React from 'react';
import GoogleSvg from '@svg/google.svg';
import FacebookSvg from '@svg/facebook.svg';
import AppleSvg from '@svg/apple.svg';
import {KadoUser} from './appUserSlice';
import {Alert, Platform, View} from 'react-native';
import {useKadoAuth} from './auth/kadoAuth';
import {MonButton} from '~/Components/Button/MonButton';
import {makeThemedStyles} from '../theme/theme';

export interface SocialUserButtonsProps {
  successCallback: (user: KadoUser) => void;
}

export const SocialUserButtons = ({
  successCallback,
}: SocialUserButtonsProps) => {
  const st = useStyles();
  const kadoAuth = useKadoAuth();
  const onGooglePress = async () => {
    try {
      var user = await kadoAuth.googleAuth();
      successCallback(user);
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  const onFbPress = async () => {
    try {
      var user = await kadoAuth.fbAuth();
      successCallback(user);
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  const onApplePress = async () => {
    try {
      var user = await kadoAuth.appleAuth();
      successCallback(user);
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  return (
    <>
      <View style={st.btnWrapper}>
        <MonButton
          icon={() => <GoogleSvg />}
          style={st.btn}
          text="Login with Google"
          onActionPress={onGooglePress}
        />
      </View>
      <View style={st.btnWrapper}>
        <MonButton
          icon={() => <FacebookSvg />}
          style={st.btn}
          text="Login with facebook"
          onActionPress={onFbPress}
        />
      </View>
      {Platform.OS === 'ios' && (
        <View style={st.btnWrapper}>
          <MonButton
            icon={() => <AppleSvg />}
            style={st.btn}
            text="Sign in with Apple"
            onActionPress={onApplePress}
          />
        </View>
      )}
    </>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  btn: {
    ...theme.socialBtnStyle,
  },
  btnWrapper: {
    marginBottom: theme.spacing(3),
  },
}));
