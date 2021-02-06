import auth from '@react-native-firebase/auth';
import {useUserService} from '../userService';

export const useEmailAuth = () => {
  const {getUserInfoFromToken} = useUserService();
  const authEmailUser = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
    if (auth().currentUser) {
      const token = await auth().currentUser?.getIdToken();
      const userInfo = await getUserInfoFromToken(token!);
      return userInfo;
    } else {
      throw Error('User is not signed');
    }
  };

  return {
    authEmailUser,
  };
};
