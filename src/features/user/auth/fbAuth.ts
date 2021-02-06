import auth from '@react-native-firebase/auth';
import {useUserService} from '../userService';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {Platform} from 'react-native';

const graphApiRequest = async <T>(path: string): Promise<T> => {
  return await new Promise((resolve, reject) => {
    new GraphRequestManager()
      .addRequest(
        new GraphRequest(path, null, (error, graphResp) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(<T>(<unknown>graphResp));
        }),
      )
      .start();
  });
};

export interface FbUserInfo {
  email: string;
  id: string;
  name: string;
}

export const useFbAuth = () => {
  const {getUserInfoFromToken} = useUserService();
  const authFbUser = async () => {
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw new Error('Fb Login cancelled');
    } else {
      // // Get user info
      // const userInfo = await graphApiRequest<FbUserInfo>(
      //   '/me?fields=id,name,email',
      // );

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data!.accessToken,
      );

      // Sign-in the user with the credential
      await auth().signInWithCredential(facebookCredential);

      if (auth().currentUser) {
        const token = await auth().currentUser?.getIdToken();
        const userInfo = await getUserInfoFromToken(token!);
        return userInfo;
      } else {
        throw Error('User is not signed');
      }
    }
  };

  return {
    authFbUser,
  };
};
