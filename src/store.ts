
import { configureStore } from '@reduxjs/toolkit';
import droneReducer from './features/drone/droneSlice';
import optionsReducer from './features/options/optionsSlice';


export const store = configureStore({
  reducer: {
    drone: droneReducer,
    options: optionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  