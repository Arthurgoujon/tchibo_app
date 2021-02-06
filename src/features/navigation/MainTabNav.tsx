import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ProductNav} from './ProductNav';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MyProductsNav} from './MyProductsNav';
import {UserInfoNav} from './UserInfoNav';
import {KadoUser} from '../user/appUserSlice';
import {ScanProductQrScreen} from '../product/ScanProductQrScreen';
import {makeThemedStyles} from '../theme/theme';

const Tab = createBottomTabNavigator();

export interface MainTabNavProps {
  isAuthenticated: boolean;
  user?: KadoUser;
}

export const MainTabNav = ({isAuthenticated, user}: MainTabNavProps) => {
  const st = useStyles();
  const iconMap: Record<string, string> = {
    AllProducts: 'cart',
    MyProducts: 'menu-outline',
    Scann: 'qr-code-outline',
    User: isAuthenticated ? 'person-outline' : 'person-add-outline',
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: st.tabbar.backgroundColor,
        inactiveBackgroundColor: st.tabbar.backgroundColor,
        showLabel: false,
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size}) => {
          const cColor = focused
            ? st.IconActive.backgroundColor
            : st.IconInActive.backgroundColor;
          const iconName = iconMap[route.name];

          return (
            <Ionicons
              name={iconName}
              size={focused ? size + 5 : size}
              color={cColor}
            />
          );
        },
      })}>
      {(user?.hasMarketTabEnabled || !isAuthenticated) && (
        <Tab.Screen name="AllProducts">
          {() => <ProductNav isAuthenticated={isAuthenticated} />}
        </Tab.Screen>
      )}
      {isAuthenticated && (
        <Tab.Screen name="MyProducts">
          {() => <MyProductsNav user={user!} />}
        </Tab.Screen>
      )}
      {user?.hasScannerTabEnabled && (
        <Tab.Screen name="Scann" component={ScanProductQrScreen} />
      )}
      <Tab.Screen name="User">
        {() => <UserInfoNav isAuthenticated={isAuthenticated} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  tabbar: {
    backgroundColor: theme.backGroundColor,
  },
  IconActive: {
    backgroundColor: theme.secondaryColor,
  },
  IconInActive: {
    backgroundColor: theme.primaryColor1,
  },
}));
