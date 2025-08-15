import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const geocodeQuery = async (query) => {
  const url = isNaN(query) 
    ? `${GEO_URL}/direct?q=${query}&limit=1&appid=${OPENWEATHER_API_KEY}`
    : `${GEO_URL}/zip?zip=${query}&appid=${OPENWEATHER_API_KEY}`;
    
  const response = await axios.get(url);
  
  if (Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  if (response.data && response.data.lat) { // For zip code responses
    return response.data;
  }
  throw new Error('Location not found.');
};

export const reverseGeocode = async (lat, lon) => {
    const response = await axios.get(`${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`);
    if (response.data && response.data.length > 0) {
        return response.data[0];
    }
    throw new Error('Could not determine location from coordinates.');
}

export const getWeather = async (lat, lon) => {
  const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' },
  });

  const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: OPENWEATHER_API_KEY, units: 'metric' }
  });

  return {
    weather: weatherResponse.data,
    forecast: forecastResponse.data.list,
  };
};