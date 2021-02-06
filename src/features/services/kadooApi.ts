import {AppConfig} from '../config/appConfig';
import auth from '@react-native-firebase/auth';
import {KadoRequestInit, useFetchWrapper} from './fetchWrapper';

export const useKadoApi = () => {
  const {fetchWrapper} = useFetchWrapper();

  const callKadoApi = async (input: string, init?: KadoRequestInit) => {
    if (!auth().currentUser) {
      return fetchWrapper(AppConfig.apiBaseUrl + input, init);
    } else {
      const token = await auth().currentUser?.getIdToken()!;
      const headers = new Headers();
      headers.append('authorization', token);

      if (init?.headers) {
        for (var p of init.headers.entries()) {
          headers.append(...p);
        }
      }

      if (init) {
        init.headers = headers;
      }
      return fetchWrapper(AppConfig.apiBaseUrl + input, init);
    }
  };

  const fetchJson = async (input: string, init?: KadoRequestInit) => {
    return callKadoApi(input, init).then((resp) => {
      return resp.json();
    });
  };
  return {callKadoApi, fetchJson, fetchWrapper};
};
