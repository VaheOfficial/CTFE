import { configureStore } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import authReducer, { logout } from './authSlice';
import userReducer, { resetUserState } from './userSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';
import adminReducer, { resetAdminState } from './adminSlice';
import globalStateReducer, { resetGlobalState } from './globalStateSlice';
import { removeAuthCookie } from '../lib/auth-utils';
import weatherReducer, { resetWeatherState } from './weatherSlice';

// Configure persistence for reducers
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // only auth and user will be persisted
};

// Define initial reducers
const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  admin: adminReducer,
  globalState: globalStateReducer,
  weather: weatherReducer,
});

// Define the RootState type based on appReducer
type RootStateType = ReturnType<typeof appReducer>;

// Root reducer with state reset on logout
const rootReducer = (state: RootStateType | undefined, action: AnyAction) => {
  // When logout action is dispatched, reset all states to their initial states
  if (action.type === 'auth/logout') {
    // First, purge the persistor's state
    // This is more reliable than just removing the item
    storage.removeItem('persist:root');
    
    // Return a new state with all slices reset to initial values
    const newState = appReducer(undefined, action);
    
    return newState;
  }
  
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types and other non-serializable data
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a logout function that resets all slices
export const logoutAndResetStore = () => {
  // First dispatch resets for each individual slice
  store.dispatch(resetUserState());
  store.dispatch(resetAdminState());
  store.dispatch(resetGlobalState());
  store.dispatch(resetWeatherState());
  // Then dispatch the main logout action that triggers the root reducer reset
  store.dispatch(logout());
  
  // Remove the auth cookie
  removeAuthCookie();
  
  // Force a purge of the persisted state
  persistor.purge();
};

export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export default store;
