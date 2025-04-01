import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    isLoading: false,
    error: null,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetAdminState: (state) => {
            // Reset to initial state
            return initialState;
        },
    },
})

export const { setUsers, setIsLoading, setError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;


