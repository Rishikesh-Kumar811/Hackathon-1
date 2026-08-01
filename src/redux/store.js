import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import localforage from 'localforage';
import transactionsReducer from './transactionSlice';

localforage.config({
  name: 'FinanceTrackerDB',
  storeName: 'transactions'
});

const persistConfig = {
  key: 'root',
  storage: localforage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, transactionsReducer);

export const store = configureStore({
  reducer: {
    transactions: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

