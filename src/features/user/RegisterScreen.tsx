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
  sameValue,
  useField,
  useForm,
  valReq,
} from '../valitation/formValidation';
import {useKadoAuth} from './auth/kadoAuth';
import {makeThemedStyles} from '../theme/theme';

export const RegisterScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<RegistrationScreenNavigationScreenProp>();
  const kadoAuth = useKadoAuth();

  const username = useField('');
  const password = useField('');
  const repeatPassword = useField('');

  const validateForm = useCallback(() => {
    const requiredText = 'Required';
    const isFormValid = [
      valReq(username, requiredText) &&
        emailVal(username, 'Invalid email format'),
      [
        valReq(password, requiredText),
        valReq(repeatPassword, requiredText),
      ].every((x) => x) &&
        sameValue([password, repeatPassword], "Password's do not match"),
    ].every((x) => x);

    return Promise.resolve(isFormValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username.value, password.value, repeatPassword.value]);

  const form = useForm(validateForm);

  const onRegisterBtnPress = async () => {
    if (!(await form.validate())) {
      return;
    }
    try {
      await kadoAuth.registerNewAppUser(username.value, password.value);
      await kadoAuth.emailAuth(username.value, password.value);
    } catch (err) {
      Alert.alert('Error', err?.message);
    }
  };

  const onLoginPress = () => {
    navigation.navigate('LoginScreen');
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
          placeholder="Email"
        />
        <MonInput
          error={password.hasError}
          helperText={password.errorText}
          value={password.value}
          onChangeText={password.onChange}
          placeholder="Password"
          secureTextEntry={true}
        />
        <MonInput
          error={repeatPassword.hasError}
          helperText={repeatPassword.errorText}
          value={repeatPassword.value}
          onChangeText={repeatPassword.onChange}
          placeholder="Repeat password"
          secureTextEntry={true}
        />
      </View>
      <View style={st.actionsWrapper}>
        <View style={st.registerBtnWrapper}>
          <MonButton
            style={st.registerBtn}
            text="Register"
            onActionPress={onRegisterBtnPress}
          />
        </View>
        <View style={st.questionsWrapper}>
          <Text style={st.question}>Already have an account? </Text>
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={st.action}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
  form: {
    marginBottom: 10,
    paddingHorizontal: theme.spacing(5),
  },
  socialWrapper: {
    paddingHorizontal: theme.spacing(3),
  },
  actionsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(3),
  },
  questionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerBtn: {
    ...theme.secondaryBtnStyle,
  },
  registerBtnWrapper: {
    marginBottom: theme.spacing(2),
    minWidth: 130,
    width: '100%',
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
