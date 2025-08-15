import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import historyReducer from '../features/history/historySlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    history: historyReducer,
  },
});