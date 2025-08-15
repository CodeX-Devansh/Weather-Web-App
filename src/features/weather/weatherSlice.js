import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { geocodeQuery, getWeather, reverseGeocode } from '../../api/openWeather';
import { addSearchToHistory } from '../../api/supabase';
import { fetchHistory } from '../history/historySlice';

// Thunk to fetch weather by a search query (city, zip)
export const fetchWeatherByQuery = createAsyncThunk(
  'weather/fetchByQuery',
  async (query, { dispatch, rejectWithValue }) => {
    try {
      const locationData = await geocodeQuery(query);
      const { lat, lon } = locationData;
      const weatherData = await getWeather(lat, lon);
      
      const newSearch = {
        location_name: locationData.name,
        latitude: lat,
        longitude: lon,
        weather_data: { ...weatherData, location: {name: locationData.name, country: locationData.country} },
      };

      // After fetching weather, add it to history and refresh the history list
      await addSearchToHistory(newSearch);
      dispatch(fetchHistory());

      return { ...weatherData, location: { name: locationData.name, country: locationData.country, lat, lon } };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Location not found. Please try again.');
    }
  }
);

// Thunk to fetch weather by browser coordinates
export const fetchWeatherByCoords = createAsyncThunk(
    'weather/fetchByCoords',
    async ({ lat, lon }, { dispatch, rejectWithValue }) => {
        try {
            const locationData = await reverseGeocode(lat, lon);
            const weatherData = await getWeather(lat, lon);

            const newSearch = {
              location_name: locationData.name,
              latitude: lat,
              longitude: lon,
              weather_data: { ...weatherData, location: { name: locationData.name, country: locationData.country } },
            };
      
            await addSearchToHistory(newSearch);
            dispatch(fetchHistory());

            return { ...weatherData, location: { name: locationData.name, country: locationData.country, lat, lon } };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Could not fetch weather for your location.');
        }
    }
);

const initialState = {
  weather: null,
  forecast: null,
  location: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
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
    builder
      .addCase(fetchWeatherByQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.weather = action.payload.weather;
        state.forecast = action.payload.forecast;
        state.location = action.payload.location;
      })
      .addCase(fetchWeatherByQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.weather = action.payload.weather;
        state.forecast = action.payload.forecast;
        state.location = action.payload.location;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setWeatherFromHistory } = weatherSlice.actions;
export default weatherSlice.reducer;