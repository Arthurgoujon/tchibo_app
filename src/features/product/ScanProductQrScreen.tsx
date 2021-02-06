import React, { useRef } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import {
  RNCamera,
  BarCodeReadEvent,
  GoogleVisionBarcodesDetectedEvent,
} from 'react-native-camera';
import queryString from 'query-string';
import { AppConfig } from '../config/appConfig';
import { useNavigation } from '@react-navigation/native';
import { ScanProductQrScreenNavigationScreenProp } from '~/navigation';
import { makeThemedStyles } from '../theme/theme';
import { PermissionLoader, PermissionType } from '~/Components/PermissionLoader';

const couponPrefix = AppConfig.couponUrlPrefix;

export const ScanProductQrScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<ScanProductQrScreenNavigationScreenProp>();
  const couponDetected = useRef(false);

  const navigateToCoupon = (url: string) => {
    if (!couponDetected.current && url.startsWith(couponPrefix)) {
      const qs = queryString.parseUrl(url);
      const key = qs.query.key?.toString();
      const id = qs.query.id?.toString();
      if (key && id) {
        couponDetected.current = true;
        navigation.navigate('Home', {
          screen: 'MyProducts',
          params: {
            screen: 'CouponDetailScreen',
            initial: false,
            params: {
              id,
              key,
            },
          },
        });
        couponDetected.current = false;
      }
    }
  };

  const barcodeDetected = (event: BarCodeReadEvent) => {
    const url = event.data;
    navigateToCoupon(url);
  };

  const googleBarcode = (event: GoogleVisionBarcodesDetectedEvent) => {
    for (let b of event.barcodes) {
      navigateToCoupon(b.data);
    }
  };

  return (
    <View style={st.screen}>
      <PermissionLoader permissions={[PermissionType.camera]}>
        <Text style={st.header}>Scan kado barcode</Text>
        <RNCamera
          onGoogleVisionBarcodesDetected={googleBarcode}
          captureAudio={false}
          style={st.camera}
          onBarCodeRead={barcodeDetected}
        />
      </PermissionLoader>
    </View>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  header: theme.headerTitle,
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
}));
