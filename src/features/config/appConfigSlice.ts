import {createSlice} from '@reduxjs/toolkit';
import {AppConfig, CouponAppConfig} from './appConfig';

const initialState: CouponAppConfig = {
  ...AppConfig,
};

const appConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

export const appConfigReducer = appConfigSlice.reducer;
