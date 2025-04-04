import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/user.type';

interface UserState {
    user: User;
    isLoading: boolean;
    error: string | null;
}

export const initialState: UserState = {
    user: {
        name: null,
        email: null,
        role: null,
        clearanceLevel: null,
        temperaturePreference: null,
        accountStatus: null,
        lastActive: null,
        lastLogin: null,
        lastPasswordChange: null,
        logEntries: [],
        activeSessions: [],
        createdAt: null,
        updatedAt: null,
        _id: null,
    },
    isLoading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetUserState: (state) => {
            // Reset to initial state
            return initialState;
        },
    },
})

export const { setUser, setIsLoading, setError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
