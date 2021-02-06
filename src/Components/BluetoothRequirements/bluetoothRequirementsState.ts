import React, { useReducer, useEffect, useCallback } from 'react';
import { State as BleState, Device, BleManager } from 'react-native-ble-plx';
import {
  RESULTS as PermResults,
  request,
  openSettings,
} from 'react-native-permissions';
import { useAppStateChange } from '../../hooks';
import { blePermissionConstants } from '../../globals';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

type BluetoothRequirementState = {
  initializing: boolean;
  permissionState?: string;
  bluetoothState?: BleState;
  error?: string;
  bleManager: BleManager;
};

type BluetoothRequirementStateAction =
  | { type: 'setPermissionState'; permissionState: string }
  | { type: 'setBluetoothState'; bluetoothState: BleState }
  | { type: 'addDevice'; device: Device }
  | { type: 'setInitializing'; payload: boolean }
  | { type: 'resetDevices' }
  | { type: 'setError'; error: string };

const BluetoothRequirementStateReducer = (
  state: BluetoothRequirementState,
  action: BluetoothRequirementStateAction,
) => {
  switch (action.type) {
    case 'setBluetoothState':
      return {
        ...state,
        bluetoothState: action.bluetoothState,
      };

    case 'setError':
      return {
        ...state,
        error: action.error,
      };

    case 'setInitializing':
      return {
        ...state,
        initializing: action.payload,
      };

    case 'setPermissionState':
      return {
        ...state,
        permissionState: action.permissionState,
      };

    default:
      return state;
  }
};

export const useBluetoothRequirementsState = () => {
  const [state, setState] = useReducer(
    BluetoothRequirementStateReducer,
    null,
    () => {
      const InitialState: BluetoothRequirementState = {
        initializing: true,
        bleManager: new BleManager(),
      };
      return InitialState;
    },
  );

  useAppStateChange('change', (appState) => {
    console.log('app state changed');
    if (appState === 'active') {
      tryToMeetRequirements();
    }
  });

  useEffect(() => {
    var blStateSub = state.bleManager.onStateChange((blState) => {
      if (blState === BleState.PoweredOn) {
        setState({
          type: 'setInitializing',
          payload: false,
        });
      }
      setState({
        type: 'setBluetoothState',
        bluetoothState: blState,
      });
    }, true);

    return () => {
      blStateSub.remove();
    };
  }, [state.bleManager]);

  useEffect(() => {
    tryToMeetRequirements();
  }, []);

  const tryToMeetRequirements = async () => {
    try {
      setState({
        type: 'setInitializing',
        payload: true,
      });
      // Show initial permission request
      let permResp = await request(blePermissionConstants);
      // Update ui permission state
      setState({
        type: 'setPermissionState',
        permissionState: permResp,
      });

      if (permResp !== PermResults.GRANTED) {
        return;
      }

      if (Platform.OS === 'android') {
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });
      }

      if ((await state.bleManager.state()) === BleState.PoweredOff) {
        await state.bleManager.enable();
      }
    } catch (err) {
      setState({
        type: 'setError',
        error: err?.message,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      tryToMeetRequirements();
      return () => {
        //Important Stop prev scann!
        setState({
          type: 'resetDevices',
        });
        state.bleManager.stopDeviceScan();
      };
    }, [state.bleManager]),
  );


  const openAppSettings = useCallback(async () => {
    await openSettings();
  }, []);

  return {
    state,
    openAppSettings,
    tryToMeetRequirements,
  };
};
