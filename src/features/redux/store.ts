import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from '../reducers/rootReducer';

export const kadoStore = configureStore({
  reducer: rootReducer,
});
export type KadoAppDispatch = typeof kadoStore.dispatch;
export type KadoAppRootState = ReturnType<typeof kadoStore.getState>;
export type KadoAsyncThunkConfig = {
  state: KadoAppRootState;
  dispatch: KadoAppDispatch;
};
