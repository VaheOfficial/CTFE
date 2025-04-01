import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  refreshToken: null,
  isLoading: false,
  error: null,
  session: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSession: (state, action) => {
      state.session = action.payload;
    },
    logout: (state) => {
      // Reset all values to initial state
      Object.assign(state, initialState);
    },
  },
});

export const { 
  setUser, 
  setToken, 
  setRefreshToken, 
  setIsAuthenticated, 
  setIsLoading, 
  setError, 
  setSession,
  logout
} = authSlice.actions;
export default authSlice.reducer;
