import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useUserService } from '../userService';

export const useAppleAuth = () => {
    const {getUserInfoFromToken} = useUserService();
    
    const authAppleUser = async () => {
        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw 'Apple Sign-In failed - no identify token returned';
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // Sign the user in with the credential
        auth().signInWithCredential(appleCredential);

        if (auth().currentUser) {
            const token = await auth().currentUser?.getIdToken();
            const userInfo = await getUserInfoFromToken(token!);
            return userInfo;
          } else {
            throw Error('User is not signed');
          }
    };

    return {
        authAppleUser,
    };
};