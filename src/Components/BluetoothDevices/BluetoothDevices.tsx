import React from 'react';
import { View } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { BluetoothRequirements } from '../BluetoothRequirements/BluetoothRequirements';
import { makeThemedStyles } from '~/features/theme/theme';
import { PermissionLoader, PermissionType } from '../PermissionLoader';
import { BluetoothDeviceList } from './BluetoothDeviceList';

export interface BluetoothDevicesProp {
  onDevicePress: (blDevice: Device) => Promise<void>;
}

const BluetoothDevices = (props: BluetoothDevicesProp) => {
  const st = useStyles();
  return (
    <View style={st.screen}>
      <PermissionLoader permissions={[PermissionType.bluetooth]}>
        <BluetoothRequirements>
          {({ bleManager }) => {
            return <BluetoothDeviceList bleManager={bleManager} onDevicePress={props.onDevicePress} />
          }
          }
        </BluetoothRequirements>
      </PermissionLoader>
    </View>
  );
};

export { BluetoothDevices };

const useStyles = makeThemedStyles((theme) => {
  return {
    screen: {
      flex: 1,
    },
  };
});
