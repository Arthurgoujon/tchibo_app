import {useKadoApi} from '../services/kadooApi';
import {KadoUser} from './appUserSlice';

export const useUserService = () => {
  const {fetchJson} = useKadoApi();

  const getUserInfoFromToken = async (
    token: string,
    signal?: AbortSignal,
  ): Promise<KadoUser> => {
    try {
      return await fetchJson('user/userInfoFromToken', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          token: token,
        }),
        signal,
      });
    } catch (err) {
      throw new Error(`Auth Error: ${err}`);
    }
  };

  return {
    getUserInfoFromToken,
  };
};
