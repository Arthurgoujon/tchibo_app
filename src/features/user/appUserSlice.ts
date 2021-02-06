import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User as GoogleUser} from '@react-native-community/google-signin';

export interface KadoUser {
  email: string;
  extraData: GoogleUser;
  hasMarketTabEnabled: boolean;
  hasScannerTabEnabled: boolean;
  role: 'store' | 'customer' | 'business_admin';
}

export interface KadoUserState {
  user?: KadoUser;
}

const IntialAuthUser: KadoUserState = {};

const appUserSlice = createSlice({
  initialState: IntialAuthUser,
  name: 'authUser',
  reducers: {
    logout(state, _) {
      state.user = undefined;
    },
    login(state, action: PayloadAction<KadoUser>) {
      state.user = action.payload;
    },
    loadUser(state, action: PayloadAction<KadoUser>) {
      state.user = action.payload;
    },
  },
});

export const appUserReducer = appUserSlice.reducer;
export const {logout, login, loadUser} = appUserSlice.actions;
