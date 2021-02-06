import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '~/navigation';
import {ProductsScreen} from '../product/ProductsShop/ProductsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LoginScreen} from '../user/LoginScreen';
import {UserInfoScreen} from '../user/UserInfoScreen';
import {ProductDetailScreen} from '../product/ProductsShop/ProductDetailScreen';
import {ProductCheckoutScreen} from '../product/ProductsShop/ProductCheckoutScreen';
import {PaymentScreen} from '../payment/PaymentScreen';
import {ConnectToDeviceScreen} from '../product/ConnectToDeviceScreen/ConnectToDeviceScreen';
import {ClaimProductScreen} from '../product/ClaimProductScreen';
import {CouponDetailScreen} from '../product/CouponDetailScreen';
import {makeThemedStyles} from '../theme/theme';
import {RegisterScreen} from '../user/RegisterScreen';
import {LocationScreen} from '../product/ProductsShop/LocationScreen';

const ProductNavStack = createStackNavigator<RootStackParamList>();
export interface ProductNavProps {
  isAuthenticated: boolean;
}
export const ProductNav = ({isAuthenticated}: ProductNavProps) => {
  const st = useStyles();
  return (
    <ProductNavStack.Navigator
      screenOptions={{
        headerBackImage: () => (
          <Ionicons name={'arrow-back-outline'} size={35} color={'#000000'} />
        ),
      }}>
      <ProductNavStack.Screen
        name="Products"
        options={{
          title: 'Products',
          ...st.stackCardStyle,
        }}
        component={ProductsScreen}
      />
      <ProductNavStack.Screen
        name="LocationScreen"
        component={LocationScreen}
      />
      <ProductNavStack.Screen
        name="PaymentScreen"
        options={{
          title: 'Pay',
          ...st.stackCardStyle,
        }}
        component={PaymentScreen}
      />
      <ProductNavStack.Screen
        name="UserInfoScreen"
        options={{
          title: 'User Info',
          ...st.stackCardStyle,
        }}
        component={UserInfoScreen}
      />
      <ProductNavStack.Screen
        options={{
          title: 'Checkout',
          ...st.stackCardStyle,
        }}
        name="ProductCheckoutScreen"
        component={ProductCheckoutScreen}
      />

      <ProductNavStack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      {!isAuthenticated && (
        <ProductNavStack.Screen
          name="LoginScreen"
          options={{
            title: 'Login',
            ...st.stackCardStyle,
          }}
          component={LoginScreen}
        />
      )}
      {!isAuthenticated && (
        <ProductNavStack.Screen
          name="RegistrationScreen"
          options={{
            title: 'Register',
            ...st.stackCardStyle,
          }}
          component={RegisterScreen}
        />
      )}
      <ProductNavStack.Screen
        name="CouponDetailScreen"
        options={{
          title: 'Coupon details',
          ...st.stackCardStyle,
        }}
        component={CouponDetailScreen}
      />
      <ProductNavStack.Screen
        name="ClaimProductScreen"
        options={{
          title: 'Claim',
          ...st.stackCardStyle,
        }}
        component={ClaimProductScreen}
      />
      <ProductNavStack.Screen
        name="ConnectToDevice"
        options={{
          title: 'Connecting to device',
          ...st.stackCardStyle,
        }}
        component={ConnectToDeviceScreen}
      />
    </ProductNavStack.Navigator>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
}));
