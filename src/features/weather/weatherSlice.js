import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWeatherAndForecast, reverseGeocode } from '../../api/openWeather';
import { addSearchToHistory } from '../../api/supabase';
import { fetchHistory } from '../history/historySlice';

// A single thunk to handle ANY search query (city, state, zip, coords)
export const handleSearch = createAsyncThunk(
  'weather/handleSearch',
  async (query, { dispatch, rejectWithValue }) => {
    const trimmedQuery = query.trim();
    
    // The API requires different parameter names for text vs. coordinates
    const params = isNaN(trimmedQuery.split(',')[0])
      ? { q: trimmedQuery } // For text like "Mizoram", "SW1A 0AA", "Tokyo"
      : { lat: trimmedQuery.split(',')[0], lon: trimmedQuery.split(',')[1] }; // For "40.71,-74.00"

    try {
      const apiData = await getWeatherAndForecast(params);
      
      const locationData = {
        name: apiData.weather.name,
        country: apiData.weather.sys.country,
        lat: apiData.weather.coord.lat,
        lon: apiData.weather.coord.lon,
      };

      const historyEntry = {
        location_name: locationData.name,
        latitude: locationData.lat,
        longitude: locationData.lon,
        weather_data: { ...apiData, location: locationData },
      };

      await addSearchToHistory(historyEntry);
      dispatch(fetchHistory());

      return { ...apiData, location: locationData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Location not found for "${trimmedQuery}".`;
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for the "My Location" button
export const fetchWeatherByCoords = createAsyncThunk(
  'weather/fetchByCoords',
  async ({ lat, lon }, { dispatch, rejectWithValue }) => {
    try {
      const apiData = await getWeatherAndForecast({ lat, lon });
      const locationData = {
        name: apiData.weather.name,
        country: apiData.weather.sys.country,
        lat: apiData.weather.coord.lat,
        lon: apiData.weather.coord.lon,
      };
      
      const historyEntry = {
        location_name: locationData.name,
        latitude: locationData.lat,
        longitude: locationData.lon,
        weather_data: { ...apiData, location: locationData },
      };

      await addSearchToHistory(historyEntry);
      dispatch(fetchHistory());

      return { ...apiData, location: locationData };
    } catch (error) {
      return rejectWithValue('Could not get weather for your location.');
    }
  }
);

const initialState = {
  weather: null, forecast: null, location: null, loading: false, error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    // This reducer is now much simpler
    setWeatherFromHistory: (state, action) => {
      const { weather_data } = action.payload;
      state.weather = weather_data.weather;
      state.forecast = weather_data.forecast;
      state.location = weather_data.location;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    // We only need to handle two main thunks now
    const handlePending = (state) => {
      state.loading = true; state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false; state.error = action.payload;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.weather = action.payload.weather;
      state.forecast = action.payload.forecast;
      state.location = action.payload.location;
    };

    builder
      .addCase(handleSearch.pending, handlePending)
      .addCase(handleSearch.fulfilled, handleFulfilled)
      .addCase(handleSearch.rejected, handleRejected)
      .addCase(fetchWeatherByCoords.pending, handlePending)
      .addCase(fetchWeatherByCoords.fulfilled, handleFulfilled)
      .addCase(fetchWeatherByCoords.rejected, handleRejected);
  },
});

export const { setWeatherFromHistory } = weatherSlice.actions;
export default weatherSlice.reducer;
