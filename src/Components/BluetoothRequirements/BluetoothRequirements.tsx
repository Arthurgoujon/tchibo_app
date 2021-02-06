import React, { ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { State as BleState } from 'react-native-ble-plx';
import { RESULTS as PermResults } from 'react-native-permissions';
import { ActionableText } from '../ActionableText/ActionableText';
import { BleManager } from 'react-native-ble-plx';
import { useBluetoothRequirementsState } from './bluetoothRequirementsState';

export interface BluetoothRequirementsPropsChildProps {
  bleManager: BleManager
}
export interface BluetoothRequirementsProps {
  children: (props: BluetoothRequirementsPropsChildProps) => ReactNode
}
export const BluetoothRequirements: React.FC<BluetoothRequirementsProps> = (props) => {
  const {
    openAppSettings,
    tryToMeetRequirements,
    state,
  } = useBluetoothRequirementsState();


  switch (state.permissionState) {
    case PermResults.BLOCKED:
      return (
        <View style={st.screen}>
          <View style={st.requiredAction}>
            <ActionableText
              text={
                'Bluetooth Permission was permanently blocked please goto application settings and enable'
              }
              actionText="Open settings"
              onActionPress={openAppSettings}
            />
          </View>
        </View>
      );

    case PermResults.DENIED:
      return (
        <View style={st.screen}>
          <View style={st.requiredAction}>
            <ActionableText
              text={"Can't scann because, Bluetooth permission was denied"}
              actionText="Enable"
              onActionPress={tryToMeetRequirements}
            />
          </View>
        </View>
      );
  }

  switch (state.bluetoothState) {
    case BleState.PoweredOff:
      return (
        <View style={st.screen}>
          <View style={st.requiredAction}>
            <ActionableText
              text={"Can't scann because, Bluetooth is disabled"}
              actionText="Enable"
              onActionPress={tryToMeetRequirements}
            />
          </View>
        </View>
      );
  }

  if (state.initializing) {
    return (
      <View style={st.screen}>
        <Text>Initializing</Text>
      </View>
    );
  }


  return <>{props.children({
    bleManager: state.bleManager
  })}</>;
};

let st = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center'
  },
  requiredAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});
