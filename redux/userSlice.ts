import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    user: {
        name: null,
        email: null,
        role: null,
        clearenceLevel: null,
        accountStatus: null,
        lastActive: null,
        lastLogin: null,
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
    },
})

export const { setUser, setIsLoading, setError } = userSlice.actions;
export default userSlice.reducer;
