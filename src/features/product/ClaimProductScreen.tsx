import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ClaimProductScreenNavigationScreenProp,
  ClaimProductScreenNavigationRouteProp,
} from 'src/navigation';
import {BluetoothDevices} from '~/Components/BluetoothDevices/BluetoothDevices';
import {confirmAlert} from '~/features/utils/Utils';
import {Device} from 'react-native-ble-plx';
import {BasicButton} from '~/Components/Button/BasicButton';
import {ProductThumbItem} from './ProductThumbCard';
import QRCode from 'react-native-qrcode-svg';
import BarcodeSvg from '@svg/barcode.svg';
import BluetoothSvg from '@svg/bluetooth.svg';
import {makeThemedStyles} from '../theme/theme';
import {ScrollView} from 'react-native-gesture-handler';

enum ActiveClaimTypeCard {
  ble = 1,
  barcode = 2,
}

export const ClaimProductScreen = () => {
  const st = useStyles();
  const navigation = useNavigation<ClaimProductScreenNavigationScreenProp>();
  const route = useRoute<ClaimProductScreenNavigationRouteProp>();
  const [claimType, setClaimType] = useState<ActiveClaimTypeCard>(
    ActiveClaimTypeCard.barcode,
  );
  const {kado, coupon} = route.params;
  const onDevicePress = async (blDevice: Device) => {
    if (
      (await confirmAlert(
        'New connection',
        'Yes',
        'No',
        `Connect to ${blDevice.name || blDevice.id}? `,
      )) === true
    ) {
      navigation.navigate('ConnectToDevice', {
        couponId: coupon.id,
        blDeviceId: blDevice.id,
        blDeviceName: blDevice.name,
        couponKey: coupon.key,
      });
    }
  };

  const renderCard = (cardType: ActiveClaimTypeCard) => {
    if (cardType === ActiveClaimTypeCard.barcode) {
      return (
        <View style={st.qrBox}>
          <QRCode size={200} value={coupon.url} />
        </View>
      );
    } else if (cardType === ActiveClaimTypeCard.ble) {
      return (
        <View style={st.storeBox}>
          <Text style={st.label}>Connect to a store</Text>
          <BluetoothDevices onDevicePress={onDevicePress} />
        </View>
      );
    }

    return <Text>This should never happen!</Text>;
  };

  return (
    <ScrollView contentContainerStyle={st.scroll}>
      <View style={st.productThumb}>
        <ProductThumbItem product={kado} />
      </View>
      <View style={st.switcherContainer}>
        <View style={st.switcher}>
          <BasicButton
            onActionPress={() => setClaimType(ActiveClaimTypeCard.barcode)}>
            {() => (
              <BarcodeSvg
                {...st.switcherBtnIcon}
                color={
                  claimType === ActiveClaimTypeCard.barcode
                    ? '#FF3333'
                    : '#013976'
                }
              />
            )}
          </BasicButton>
          <BasicButton
            onActionPress={() => setClaimType(ActiveClaimTypeCard.ble)}>
            {() => (
              <BluetoothSvg
                {...st.switcherBtnIcon}
                color={
                  claimType === ActiveClaimTypeCard.ble ? '#FF3333' : '#013976'
                }
              />
            )}
          </BasicButton>
        </View>
      </View>
      {renderCard(claimType)}
    </ScrollView>
  );
};

const useStyles = makeThemedStyles((theme) => ({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.distanceFromScreenEdges,
  },
  switcherBtnIcon: {
    height: 46,
    width: 46,
  },
  switcherContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  switcher: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
  },
  productThumb: {
    height: 229,
    width: '100%',
    maxWidth: theme.kadoCardMaxWidth,
    alignSelf: 'center',
  },
  label: {
    ...theme.mainFont,
    marginLeft: 10,
    fontSize: 19,
    lineHeight: 22.31,
    color: 'black',
  },
  storeBox: {
    flex: 1,
  },
  qrBox: {
    alignItems: 'center',
    marginVertical: 29,
  },
}));
