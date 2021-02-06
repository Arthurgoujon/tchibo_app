import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '~/navigation';
import {useSelector} from 'react-redux';
import {
  authenticatedUserSelector,
  isUserAuthenticatedSelector,
} from '../user/userSelectors';
import {MainTabNav} from './MainTabNav';
import {PurchaseSuccessScreen} from '../product/ProductsShop/PurchaseSuccessScreen';
import {makeThemedStyles} from '../theme/theme';
import {ConnectToDeviceScreen} from '../product/ConnectToDeviceScreen/ConnectToDeviceScreen';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNav = () => {
  const st = useStyles();
  const isAuth = useSelector(isUserAuthenticatedSelector);
  const userState = useSelector(authenticatedUserSelector);
  return (
    <RootStack.Navigator
      screenOptions={{
        headerBackImage: () => (
          <Ionicons name={'arrow-back-outline'} size={35} color={'#000000'} />
        ),
      }}>
      <RootStack.Screen
        name="Home"
        options={{
          headerShown: false,
        }}>
        {(_props) => (
          <MainTabNav isAuthenticated={isAuth} user={userState?.user} />
        )}
      </RootStack.Screen>
      <RootStack.Screen
        name="PurchaseSuccessScreen"
        options={{
          headerShown: false,
        }}
        component={PurchaseSuccessScreen}
      />
      <RootStack.Screen
        name="ConnectToDevice"
        options={{
          headerShown: false,
        }}
        component={ConnectToDeviceScreen}
      />
    </RootStack.Navigator>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
}));
