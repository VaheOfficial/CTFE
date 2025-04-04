import { createSlice } from '@reduxjs/toolkit';

interface WeatherState {
    temperaturePreference: string | null;
    temperatureC: number | null;
    temperatureF: number | null;
    humidity: number | null;
    windSpeed: number | null;
    windDirection: string | null;
    pressure: number | null;
    condition: string | null;
    updatedAt: string | null;
    altitude: number | null;
    windChill: number | null;

}

const initialState: WeatherState = {
    temperaturePreference: null,
    temperatureC: null,
    temperatureF: null,
    humidity: null,
    windSpeed: null,
    windDirection: null,
    pressure: null,
    condition: null,
    updatedAt: null,
    altitude: null,
    windChill: null,
}

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        setTemperaturePreference: (state, action) => {
            state.temperaturePreference = action.payload;
        },
        setWeatherData: (state, action) => {
            state.temperatureC = action.payload.temperatureC;
            state.temperatureF = action.payload.temperatureF;
            state.humidity = action.payload.humidity;
            state.windSpeed = action.payload.windSpeed;
            state.windDirection = action.payload.windDirection;
            state.pressure = action.payload.pressure;
            state.condition = action.payload.condition;
            state.updatedAt = action.payload.updatedAt;
            state.altitude = action.payload.altitude;
            state.windChill = action.payload.windChill;
        },
        resetWeatherState: (state) => {
            return initialState;
        },
    },
})

export const { setTemperaturePreference, setWeatherData, resetWeatherState } = weatherSlice.actions;
export default weatherSlice.reducer;
