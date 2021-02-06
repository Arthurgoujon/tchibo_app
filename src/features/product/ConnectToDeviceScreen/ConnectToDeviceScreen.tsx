import React from 'react';
import { View } from 'react-native';
import { BluetoothRequirements } from '../../../Components/BluetoothRequirements/BluetoothRequirements';
import { makeThemedStyles } from '~/features/theme/theme';
import { PermissionLoader, PermissionType } from '~/Components/PermissionLoader';
import { DeviceConnection } from './DeviceConnection';

const ConnectToDeviceScreen = () => {
  const st = useStyles();
  return (
    <View style={st.screen}>
      <PermissionLoader permissions={[PermissionType.bluetooth]}>
        <BluetoothRequirements>
          {({ bleManager }) => {
            return <DeviceConnection bleManager={bleManager} />
          }}
        </BluetoothRequirements>
      </PermissionLoader>
    </View>
  );
};

export { ConnectToDeviceScreen };

const useStyles = makeThemedStyles((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.mainColor,
  },
}));
