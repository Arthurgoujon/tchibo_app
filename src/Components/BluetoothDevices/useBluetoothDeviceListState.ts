import { useEffect, useReducer } from 'react';
import { BleManager, Device, State as BleState } from 'react-native-ble-plx';
import { couponBleServiceConstants, log } from '../../globals';

export interface UseBluetoothDeviceListStateProps {
  bleManager: BleManager
}
export const useBluetoothDeviceListState = (props: UseBluetoothDeviceListStateProps) => {
  const [state, setState] = useReducer(DeviceScreenStateReducer, null, () => {
    const InitialState: DevicScreenState = {
      deviceListMap: new Map<string, Device>(),
      bleManager: props.bleManager,
    };
    return InitialState;
  });

  const startBluetoothScan = async () => {
    state.bleManager.startDeviceScan(
      [couponBleServiceConstants.serviceUid],
      null,
      (error, device) => {
        if (error) {
          log.error(error);
          // Update ui error state
          setState({
            type: 'setError',
            error: error.reason || "Can't start Bluetooth scan, Unknown error",
          });
          return;
        }

        if (device == null) {
          log.error('Bluetooth device is null, WTF ?');
          return;
        }

        setState({
          type: 'addDevice',
          device: device,
        });
      },
    );
  };

  useEffect(() => {
    startBluetoothScan();
  }, [])

  return {
    state,
    startBluetoothScan,
  };
};

type DevicScreenState = {
  permissionState?: string;
  bluetoothState?: BleState;
  deviceListMap: Map<string, Device>;
  error?: string;
  bleManager: BleManager;
};

type DevicScreenStateAction =
  | { type: 'addDevice'; device: Device }
  | { type: 'resetDevices' }
  | { type: 'setError'; error: string };

const DeviceScreenStateReducer = (
  state: DevicScreenState,
  action: DevicScreenStateAction,
) => {
  switch (action.type) {
    case 'resetDevices':
      return {
        ...state,
        deviceListMap: new Map<string, Device>(),
      };
    case 'addDevice':
      var mp = new Map(state.deviceListMap);
      mp.set(
        `${action.device?.name || 'Unknown'} - ${action.device?.id}`,
        action.device,
      );
      return {
        ...state,
        deviceListMap: mp,
      };

    case 'setError':
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};
