import { configureStore } from '@reduxjs/toolkit';
import dataProductReducer from './dataProductSlice';

export const store = configureStore({
  reducer: {
    dataProducts: dataProductReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;