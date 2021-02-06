import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { useGoogleAuth } from '../userHooks';
import { useEmailAuth } from './emailAuth';
import { useFbAuth } from './fbAuth';
import { logout as LogOutEvent, login, loadUser } from '../appUserSlice';
import { StorageItems } from '~/features/storage/storage';
import { useAppleAuth } from './appleAuth';

export const useKadoAuth = () => {
  const { authGoogleUser } = useGoogleAuth();
  const { authFbUser } = useFbAuth();
  const { authAppleUser } = useAppleAuth();
  const { authEmailUser } = useEmailAuth();
  const dispatch = useDispatch();

  const loadAuthInfo = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const kadoUsr = await StorageItems.getAuthInfoFromStorage();
        dispatch(loadUser(kadoUsr));
      } catch (err) {
        await auth().signOut();
      }
    }
  };

  const logout = async () => {
    if (auth().currentUser) {
      dispatch(LogOutEvent(null));
      await auth().signOut();
      await StorageItems.deleteUserInfo();
    }
  };

  const fbAuth = async () => {
    const user = await authFbUser();
    await StorageItems.setAuthUserInfo(user);
    dispatch(login(user));
    return user;
  };

  const googleAuth = async () => {
    const user = await authGoogleUser();
    await StorageItems.setAuthUserInfo(user);
    dispatch(login(user));
    return user;
  };

  const appleAuth = async () => {
    const user = await authAppleUser();
    await StorageItems.setAuthUserInfo(user);
    dispatch(login(user));
    return user;
  };

  const emailAuth = async (email: string, password: string) => {
    const user = await authEmailUser(email, password);
    await StorageItems.setAuthUserInfo(user);
    dispatch(login(user));
    return user;
  };

  const registerNewAppUser = async (username: string, password: string) => {
    await auth()
      .createUserWithEmailAndPassword(username, password)
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          throw Error('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          throw Error('That email address is invalid!');
        }

        throw Error(error);
      });

    console.log('User account created & signed in!');
  };

  return {
    googleAuth,
    fbAuth,
    appleAuth,
    emailAuth,
    loadAuthInfo,
    logout,
    registerNewAppUser,
  };
};
