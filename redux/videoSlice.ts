import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    videoSources: [],
    currentlyPlaying: null,
    isLoading: false,
    error: null,
}

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoSources: (state, action) => {
            state.videoSources = action.payload;
        },
        setCurrentlyPlaying: (state, action) => {
            state.currentlyPlaying = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetVideoState: (state) => {
            state.videoSources = [];
            state.currentlyPlaying = null;
            state.isLoading = false;
            state.error = null;
        },
    },
})
export default videoSlice.reducer;