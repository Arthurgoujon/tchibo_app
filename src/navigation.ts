import {
  CommonActions,
  LinkingOptions,
  RouteProp,
  StackNavigationState,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {LocationScreenParams} from './features/product/ProductsShop/LocationScreen';
import {Coupon, KadoProduct, KadoStore} from './features/product/ProductTypes';

export interface NavigateAfterParams {
  key: keyof RootStackParamList;
  navigatedFromScreenKey: string;
  params?: RootStackParamList[keyof RootStackParamList];
}

export const CreateNavScreenParam = <
  RouteName extends keyof RootStackParamList
>(
  ...args: [RouteName, string, RootStackParamList[RouteName]]
) => {
  const [key, navigatedFromScreenKey, params] = args;

  return {
    key,
    navigatedFromScreenKey,
    params,
  };
};

export const getDispatchForNavigateAfterScreen = (
  state: StackNavigationState,
  navAfterParams: NavigateAfterParams,
) => {
  const indexOfKey = state.routes.findIndex(
    (x) => x.key === navAfterParams.navigatedFromScreenKey,
  );

  const routes =
    indexOfKey === -1 ? state.routes : state.routes.slice(0, indexOfKey + 1);

  routes.push({
    name: navAfterParams.key,
    params: navAfterParams.params,
    key: '',
  });

  return CommonActions.reset({
    ...state,
    routes,
    index: routes.length - 1,
  });
};

export const CouponAppLinkingOptions: LinkingOptions = {
  prefixes: ['https://monkado.co.uk/appLink', 'https://monkado.co.uk'],
  config: {
    screens: {
      Home: {
        screens: {
          AllProducts: {
            initialRouteName: 'Products',
            screens: {
              CouponDetailScreen: {
                path: 'coupon',
                exact: true,
              },
            },
          },
        },
      },
    },
  },
};

export type ProductDetailScreenParams =
  | {id: string; key: string}
  | {id: string};

export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  SplashScreen: undefined;
  UserInfoScreen: undefined;
  RegistrationScreen: undefined;
  ProductCheckoutScreen: {product: KadoProduct};
  StoreSelectorScreen: {stores: KadoStore};
  LoginScreen: undefined;
  MyProductsScreen: undefined;
  MyProductsHistory: undefined;
  ProductScreen: {id: string; key?: string};
  ClaimProductScreen: {kado: KadoProduct; coupon: Coupon};
  ScanProductQrScreen: undefined;
  CouponDetailScreen: ProductDetailScreenParams;
  LocationScreen: LocationScreenParams;
  ConnectToDevice: {
    couponId: string;
    blDeviceId: string;
    blDeviceName: string | null;
    couponKey?: string;
  };
  PurchaseSuccessScreen: undefined;
  ProductDetailScreen: {product: KadoProduct};
  PaymentScreen: {quantity: number; product: KadoProduct};
};

export type ConnectToDeviceScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'ConnectToDevice'
>;

export type ConnectToDeviceScreeNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'ConnectToDevice'
>;

export type CouponDetailScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'CouponDetailScreen'
>;

export type CouponDetailScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'CouponDetailScreen'
>;

export type ProductDetailScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'ProductDetailScreen'
>;

export type ProductDetailScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetailScreen'
>;

export type ProductScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'ProductScreen'
>;

export type ProductScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'ProductScreen'
>;

export type MyProductsScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'MyProductsScreen'
>;

export type ClaimProductScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'ClaimProductScreen'
>;
export type ClaimProductScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'ClaimProductScreen'
>;

export type ScanProductQrScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'ScanProductQrScreen'
>;

export type ScanProductQrScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'ScanProductQrScreen'
>;

export type MyProductsHistoryScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'MyProductsHistory'
>;

export type LoginScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export type LoginScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'LoginScreen'
>;

export type RegistrationScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'RegistrationScreen'
>;
export type RegistrationScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'RegistrationScreen'
>;

export type ProductCheckoutScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'ProductCheckoutScreen'
>;

export type ProductCheckoutScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'ProductCheckoutScreen'
>;

export type StoreSelectorScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'StoreSelectorScreen'
>;

export type StoreSelectorScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'StoreSelectorScreen'
>;

export type UserInfoScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'UserInfoScreen'
>;

export type SplashScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'SplashScreen'
>;
export type PurchaseSuccessScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'PurchaseSuccessScreen'
>;

export type PurchaseSuccessScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'PurchaseSuccessScreen'
>;

export type PaymentScreenNavigationRouteProp = RouteProp<
  RootStackParamList,
  'PaymentScreen'
>;

export type PaymentScreenNavigationScreenProp = StackNavigationProp<
  RootStackParamList,
  'PaymentScreen'
>;

export type ConnectToDeviceScreenRouteProp = RouteProp<
  RootStackParamList,
  'ConnectToDevice'
>;

export type ConnectToDeviceScreenProp = StackNavigationProp<
  RootStackParamList,
  'ConnectToDevice'
>;

export type LocationScreenRouteProp = RouteProp<
  RootStackParamList,
  'LocationScreen'
>;

export type LocationScreenProp = StackNavigationProp<
  RootStackParamList,
  'LocationScreen'
>;
