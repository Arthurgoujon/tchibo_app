import {useRef, useEffect, useState, DependencyList, useCallback} from 'react';
import {AppState, AppStateEvent, AppStateStatus} from 'react-native';
import useDeepCompareEffect from 'use-deep-compare-effect';
import deepDiffer from 'react-native/Libraries/Utilities/differ/deepDiffer';

export function useAppStateChange(
  type: AppStateEvent,
  callback: (e: AppStateStatus) => void,
) {
  const refState = useRef<AppStateStatus | null>();

  useEffect(() => {
    const appStateListener = async (appState: AppStateStatus) => {
      if (refState.current !== appState) {
        refState.current = appState;
        callback(appState);
      }
    };

    AppState.addEventListener(type, appStateListener);
    return () => {
      AppState.removeEventListener(type, appStateListener);
    };
  }, []);
}

export const useDebouncedValue = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let cancelled = false;
    const handler = setTimeout(() => {
      if (cancelled) {
        return;
      }

      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
      cancelled = true;
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebounce = <D extends DependencyList>(
  delay: number,
  callback: (value: D) => void,
  deps: D,
  initialDelay: number = 0,
) => {
  const [debouncedValue, setDebouncedValue] = useState<D | null>(null);
  const memoizedCallback = useCallback(callback, deps);
  let currentDelay = useRef(initialDelay);

  useDeepCompareEffect(() => {
    const handler = setTimeout(() => {
      if (deepDiffer(debouncedValue, deps)) {
        setDebouncedValue(deps);
        memoizedCallback(deps);
      }
    }, currentDelay.current);
    // Set delay
    currentDelay.current = delay;

    return () => {
      clearTimeout(handler);
    };
  }, [delay, memoizedCallback, deps]);

  return debouncedValue;
};

export const useDateUtil = () => {
  const formatDate = (date: Date) => {
    if (!date) {
      return '';
    }
    let parsedDate: Date;
    if (typeof date.getMonth === 'function') {
      parsedDate = date;
    } else {
      parsedDate = new Date(date);
    }
    return `${parsedDate.getDate()}/${parsedDate.getMonth()}/${parsedDate.getFullYear()} at ${parsedDate.getHours()}: ${parsedDate.getMinutes()}`;
  };

  return {
    formatDate,
  };
};
