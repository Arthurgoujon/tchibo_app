import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '~/navigation';
import {UserInfoScreen} from '../user/UserInfoScreen';
import {makeThemedStyles} from '../theme/theme';
import {LoginScreen} from '../user/LoginScreen';
import {RegisterScreen} from '../user/RegisterScreen';

const UserInfoStack = createStackNavigator<RootStackParamList>();

export interface UserInfoNavProps {
  isAuthenticated: boolean;
}

export const UserInfoNav = ({isAuthenticated}: UserInfoNavProps) => {
  const st = useStyles();
  return (
    <UserInfoStack.Navigator
      screenOptions={{
        headerBackImage: () => (
          <Ionicons name={'arrow-back-outline'} size={35} color={'#000000'} />
        ),
      }}>
      {!isAuthenticated && (
        <UserInfoStack.Screen
          name="LoginScreen"
          options={{
            title: 'Login',
            ...st.stackCardStyle,
          }}
          component={LoginScreen}
        />
      )}
      {!isAuthenticated && (
        <UserInfoStack.Screen
          name="RegistrationScreen"
          options={{
            title: 'Register',
            ...st.stackCardStyle,
          }}
          component={RegisterScreen}
        />
      )}
      {isAuthenticated && (
        <UserInfoStack.Screen
          name="UserInfoScreen"
          options={{
            title: 'User information',
            ...st.stackCardStyle,
          }}
          component={UserInfoScreen}
        />
      )}
    </UserInfoStack.Navigator>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
}));
