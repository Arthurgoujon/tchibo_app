import {AppConfig} from '../config/appConfig';
import {LogBox} from 'react-native';

if (__DEV__) {
  LogBox.ignoreLogs(['Setting a timer']);
}

export const useFetchWrapper = () => {
  const fetchWrapper = async (input: string, init?: KadoRequestInit) => {
    const apiResponse = await fetchWithTimeout(input, init);

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      throw Error(text || apiResponse.statusText || 'Server error');
    }
    return apiResponse;
  };

  return {
    fetchWrapper,
  };
};

export interface KadoRequestInit extends RequestInit {
  RequestTimeout?: number;
}

export const fetchWithTimeout = async (
  input: string,
  init?: KadoRequestInit,
) => {
  const controller = new AbortController();
  const signal = controller.signal;

  // If abort signal was passed from outside, we should listen for it's abort event too
  if (init?.signal) {
    init.signal.onabort = () => {
      controller.abort();
    };
  }

  const requestTimeoutLimit =
    init?.RequestTimeout || AppConfig.defaultRequestTimeoutMs;

  // timeout to simulate abort
  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, requestTimeoutLimit);

  const initWithAbort = {
    ...init,
    signal,
  };

  try {
    const resp = await fetch(input, initWithAbort);
    return resp;
  } catch (err) {
    if (err instanceof Error) {
      // Chnage error message for aborted signal
      if (err.message.indexOf('AbortError') !== 0) {
        throw new Error('Network request timed out');
      }

      throw err;
    }

    throw Error(err);
  } finally {
    clearTimeout(timeoutHandle);
  }
};
