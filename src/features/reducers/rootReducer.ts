import {combineReducers} from '@reduxjs/toolkit';
import {appConfigReducer} from '../config/appConfigSlice';
import {appUserReducer} from '../user/appUserSlice';

export const rootReducer = combineReducers({
  config: appConfigReducer,
  appUser: appUserReducer,
});
