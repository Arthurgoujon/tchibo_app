import {KadoAppRootState} from '../redux/store';

export const authenticatedUserSelector = (state: KadoAppRootState) =>
  state.appUser;

export const isUserAuthenticatedSelector = (state: KadoAppRootState) =>
  !!state.appUser?.user;
