// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

// FIX: Custom Storage Wrapper for Vite compatibility
const createCustomStorage = () => {
  return {
    getItem: (key: string) => {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem: (key: string, item: string) => {
      window.localStorage.setItem(key, item);
      return Promise.resolve(item);
    },
    removeItem: (key: string) => {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

const storage = createCustomStorage();

// 1. Combine all reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  products: productReducer,
  auth: authReducer,
  ui: uiReducer,
});

// 2. Configure Persist
const persistConfig = {
  key: 'sob-luxe-root',
  storage, // Using our custom Vite-safe storage
  whitelist: ['cart', 'auth'], // Only save these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;