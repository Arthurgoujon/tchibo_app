import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {useUserService} from './userService';
import {AppConfig} from '../config/appConfig';

export const useGoogleAuth = () => {
  const {getUserInfoFromToken} = useUserService();

  const ensureGoogleApiSetup = () => {
    GoogleSignin.configure({
      webClientId: AppConfig.firebaseWebClientId,
    });
  };

  const authGoogleUser = async () => {
    ensureGoogleApiSetup();
    await GoogleSignin.signOut();
    const data = await GoogleSignin.signIn();
    const googleCredentials = auth.GoogleAuthProvider.credential(data.idToken);
    await auth().signInWithCredential(googleCredentials);

    if (auth().currentUser) {
      const token = await auth().currentUser?.getIdToken();
      const userInfo = await getUserInfoFromToken(token!);
      return userInfo;
    } else {
      throw Error('User is not signed');
    }
  };

  return {
    authGoogleUser,
  };
};
