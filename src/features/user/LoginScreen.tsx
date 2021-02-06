import React, {useCallback} from 'react';
import {View, Text, Alert} from 'react-native';
import {MonButton} from '../../Components/Button/MonButton';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {MonInput} from '../../Components/MonInput/MonInput';
import {SocialUserButtons} from './SocialUserButtons';
import {KadoUser} from './appUserSlice';
import {useNavigation} from '@react-navigation/native';
import {RegistrationScreenNavigationScreenProp} from '~/navigation';
import {
  emailVal,
  useField,
  useForm,
  valReq,
} from '../valitation/formValidation';
import {useKadoAuth} from './auth/kadoAuth';
import {makeThemedStyles} from '../theme/theme';

export const LoginScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<RegistrationScreenNavigationScreenProp>();
  const kadoAuth = useKadoAuth();
  const username = useField('');
  const password = useField('');

  const validation = useCallback(() => {
    const requiredText = 'Required';

    const isUserValid = [
      valReq(username, requiredText) &&
        emailVal(username, 'Invalid email format'),
      valReq(password, requiredText),
    ].every((x) => x);
    return Promise.resolve(isUserValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username.value, password.value]);

  const form = useForm(validation);

  const onLoginBtnPress = async () => {
    form.setIsSubmited(true);
    if (!(await form.validate())) {
      return;
    }

    try {
      await kadoAuth.emailAuth(username.value, password.value);
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  const onRegister = () => {
    navigation.navigate('RegistrationScreen');
  };

  const onLoginSuccess = (_user: KadoUser) => {};

  return (
    <ScrollView>
      <View style={st.socialWrapper}>
        <SocialUserButtons successCallback={onLoginSuccess} />
      </View>
      <View style={st.form}>
        <MonInput
          error={username.hasError}
          helperText={username.errorText}
          value={username.value}
          onChangeText={username.onChange}
          placeholder="Username"
        />
        <MonInput
          error={password.hasError}
          helperText={password.errorText}
          value={password.value}
          onChangeText={password.onChange}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>

      <View style={st.actionsWrapper}>
        <View style={st.loginBtnWrapper}>
          <MonButton
            style={st.loginBtn}
            text="Login"
            onActionPress={onLoginBtnPress}
          />
        </View>

        <View style={st.questionsWrapper}>
          <Text style={st.question}>New to monkado? </Text>
          <TouchableOpacity onPress={onRegister}>
            <Text style={st.action}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
  socialWrapper: {
    paddingHorizontal: theme.spacing(3),
  },
  form: {
    marginBottom: 10,
    paddingHorizontal: theme.spacing(5),
  },
  actionsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(3),
  },
  loginBtnWrapper: {
    marginBottom: theme.spacing(2),
    minWidth: 130,
    width: '100%',
  },
  loginBtn: {
    ...theme.secondaryBtnStyle,
  },
  questionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  action: {
    ...theme.mainFont,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textDecorationColor: theme.secondaryColor,
    color: theme.secondaryColor,
  },
  question: {
    ...theme.mainFont,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '400',
  },
}));
