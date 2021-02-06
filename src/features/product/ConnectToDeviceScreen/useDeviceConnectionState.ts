import { KadoSummary } from '../ProductTypes';
import { useReducer, useEffect } from 'react';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { encode, decode } from 'js-base64';
import {
  couponBleServiceConstants as serviceConst,
  log,
  ReaqtQueryQueryNames,
} from '~/globals';
import {
  ConnectToDeviceScreenProp,
  ConnectToDeviceScreenRouteProp,
} from '~/navigation';
import { useProductService } from '../productService';
import { useQueryClient } from 'react-query';
import { useMyproductsHistoryQuery } from '../MyProducts/myProductQuery';

export interface useConnectToDeviceScreenStateProps {
  bleManager: BleManager
}
export const useConnectToDeviceScreenState = (props: useConnectToDeviceScreenStateProps) => {
  const navigation = useNavigation<ConnectToDeviceScreenProp>();
  const route = useRoute<ConnectToDeviceScreenRouteProp>();
  const { getStorekey } = useProductService();

  const queryCache = useQueryClient();

  const [state, setState] = useReducer(
    ConnectToDeviceStateReducer,
    null,
    () => {
      const initialState: ConnectToDeviceState = {
        bleManager: props.bleManager,
        deviceId: route.params.blDeviceId,
        deviceName: route.params.blDeviceName,
        status: 'Processing',
        error: null,
        isLoading: false,
      };
      return initialState;
    },
  );

  useEffect(() => {
    startConnection();
    return () => {
      state.bleManager.cancelDeviceConnection(state.deviceId);
    };
  }, []);

  const parseRxChar = (charValue: Characteristic) => {
    try {
      const parts = decode(charValue?.value!).toString().split(',');

      const parsed: CouponRxChar = {
        randomNumber: parts[0],
        storeId: parts[1],
      };
      return parsed;
    } catch (ex) {
      log.error(ex);
    }
    throw new Error(
      `Got invalid ( ${charValue?.value}) random number from device`,
    );
  };
  const myProducts = useMyproductsHistoryQuery();
  const startConnection = async () => {
    try {
      setState({
        type: 'setLoading',
        payload: true,
      });
      setState({
        type: 'setStatus',
        status: 'Processing',
      });

      if (await state.bleManager.isDeviceConnected(state.deviceId)) {
        await state.bleManager.cancelDeviceConnection(state.deviceId);
      }

      const device = await state.bleManager.connectToDevice(state.deviceId, {
        autoConnect: false,
        timeout: 30000,
      });

      await device.discoverAllServicesAndCharacteristics();

      const services = await state.bleManager.servicesForDevice(state.deviceId);
      const targetService = services.find(
        (x) => x.uuid === serviceConst.serviceUid,
      );

      if (targetService == null) {
        setState({
          type: 'setError',
          error: `Can't find service with uuid ${serviceConst.serviceUid} on this device`,
        });
        return;
      }

      const chars = await targetService.characteristics();

      const rxChar = chars.find((x) => x.uuid === serviceConst.rxCharUid);

      if (rxChar == null) {
        setState({
          type: 'setError',
          error: `Can't find Rx char with uuid ${serviceConst.rxCharUid} on this device`,
        });
        return;
      }

      const txChar = chars.find((x) => x.uuid === serviceConst.txCharUid);
      if (txChar == null) {
        setState({
          type: 'setError',
          error: `Can't find tx char with uuid ${serviceConst.txCharUid} on this device`,
        });
        return;
      }

      // Wrap notification in promise for convenience
      const notifPromise = () => {
        return new Promise<Characteristic>((resolve, reject) => {
          const txCharSubs = txChar.monitor((monitorError, charValue) => {
            if (monitorError) {
              reject(monitorError);
            } else {
              resolve(charValue!);
            }
            txCharSubs.remove();
          });
        });
      };

      const storeInfo = parseRxChar(await notifPromise());

      const getStoreKeyResponse = await getStorekey(
        route.params.couponId,
        storeInfo.storeId,
        storeInfo.randomNumber,
        route.params.couponKey,
      );

      //to be completed. They also need to be sorted from most recent to oldest
      let completeHistory: Array<KadoSummary> = [];
      let resp = await myProducts.refetch();
      if (resp.data) {
        completeHistory = resp.data.map((item) => {
          const productSummary = {
            name: item.kadoName,
            user: item.userName,
            date: item.date,
          };
          return productSummary;
        });
      }

      //we are only taking the first 4 elements for now, as the char size is restricted on
      // the ESP32
      const history4 = completeHistory.slice(0, 4);

      const fullResponse = {
        accessKey: getStoreKeyResponse.storeKey,
        history: history4,
      };
      console.log(fullResponse);

      const jsonString = JSON.stringify(fullResponse);
      await rxChar.writeWithResponse(encode(jsonString!));

      setState({
        type: 'setStatus',
        status: 'All done Enjoy!',
      });
      setState({
        type: 'setLoading',
        payload: false,
      });

      setTimeout(() => {
        navigation.navigate('Home', {
          screen: 'MyProducts',
          params: {
            screen: 'CouponDetailScreen',
            initial: false,
            params: {
              id: route.params.couponId,
              key: route.params.couponKey,
            },
          },
        });
      }, 1000);

      await queryCache.invalidateQueries(ReaqtQueryQueryNames.myproducts);
      await queryCache.invalidateQueries(
        ReaqtQueryQueryNames.myproductsHistory,
      );
    } catch (ex) {
      setState({
        type: 'setError',
        error: `Unexpected error: ${ex}`,
      });
    }
  };

  return {
    state,
    startConnection,
  };
};

type CouponRxChar = {
  randomNumber: string;
  storeId: string;
};

type ConnectToDeviceState = {
  deviceId: string;
  deviceName: string | null;
  status: string | null;
  isLoading: boolean;
  error: string | null;
  bleManager: BleManager;
};

type ConnectToDeviceStateAction =
  | { type: 'setStatus'; status: string }
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setError'; error: string };

const ConnectToDeviceStateReducer = (
  state: ConnectToDeviceState,
  action: ConnectToDeviceStateAction,
): ConnectToDeviceState => {
  switch (action.type) {
    case 'setLoading':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'setStatus':
      return {
        ...state,
        status: action.status,
        error: null,
      };

    case 'setError':
      return {
        ...state,
        status: null,
        error: action.error,
        isLoading: false,
      };

    default:
      return state;
  }
};
