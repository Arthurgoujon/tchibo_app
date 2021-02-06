import {logger} from 'react-native-logs';
import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';

const log = logger.createLogger();

export {log};

export const blePermissionConstants = Platform.select({
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
})!;

export const couponBleServiceConstants = {
  serviceUid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e'.toLowerCase(),
  rxCharUid: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(),
  txCharUid: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'.toLowerCase(),
};

export enum ReaqtQueryQueryNames {
  'products' = 'products',
  'myproducts' = 'myproducts',
  'myproductsHistory' = 'myproductsHistory',
  'couponDetailsQuery' = 'couponDetailsQuery',
  'usePlaces' = 'usePlaces',
}
