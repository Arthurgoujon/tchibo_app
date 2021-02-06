import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '~/navigation';
import {MyProductsScreen} from '../product/MyProducts/MyProductsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MyProductsHistoryScreen} from '../product/MyProducts/MyProductHistoryScreen';
import {ClaimProductScreen} from '../product/ClaimProductScreen';
import {CouponDetailScreen} from '../product/CouponDetailScreen';
import {KadoUser} from '../user/appUserSlice';
import {makeThemedStyles} from '../theme/theme';

export interface MyProductsNavProps {
  user: KadoUser;
}
export const MyProductStack = createStackNavigator<RootStackParamList>();
export const MyProductsNav = (props: MyProductsNavProps) => {
  const st = useStyles();
  return (
    <MyProductStack.Navigator
      initialRouteName={
        props.user.role === 'store' ? 'MyProductsHistory' : 'MyProductsScreen'
      }
      screenOptions={{
        headerBackImage: () => (
          <Ionicons name={'arrow-back-outline'} size={35} color={'#000000'} />
        ),
      }}>
      <MyProductStack.Screen
        name="MyProductsScreen"
        options={{
          title: 'My products',
          ...st.stackCardStyle,
        }}
        component={MyProductsScreen}
      />

      <MyProductStack.Screen
        name="MyProductsHistory"
        options={{
          title: 'Product History',
          ...st.stackCardStyle,
        }}
        component={MyProductsHistoryScreen}
      />
      <MyProductStack.Screen
        name="CouponDetailScreen"
        options={{
          title: 'Product Details',
          ...st.stackCardStyle,
        }}
        component={CouponDetailScreen}
      />
      <MyProductStack.Screen
        name="ClaimProductScreen"
        options={{
          title: 'Claim',
          ...st.stackCardStyle,
        }}
        component={ClaimProductScreen}
      />
    </MyProductStack.Navigator>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  stackCardStyle: theme.stackCardStyle,
}));
