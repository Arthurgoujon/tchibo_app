import AsyncStorage from '@react-native-community/async-storage';
import {KadoUser} from '../user/appUserSlice';

const authUserKey = 'authUser';

const setAuthUserInfo = async (user: KadoUser) => {
  await AsyncStorage.setItem(authUserKey, JSON.stringify(user));
};

const getAuthInfoFromStorage = async (): Promise<KadoUser> => {
  const user = await AsyncStorage.getItem(authUserKey);
  if (!user) {
    throw new Error('There is no user info in storage');
  }
  return JSON.parse(user);
};

const deleteUserInfo = async () => {
  await AsyncStorage.removeItem(authUserKey);
};

const hasAuthUserInfo = async () => {
  const user = await AsyncStorage.getItem(authUserKey);
  return !!user;
};

export const StorageItems = {
  setAuthUserInfo,
  hasAuthUserInfo,
  deleteUserInfo,
  getAuthInfoFromStorage,
};
