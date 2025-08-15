import axios from 'axios';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetches current weather AND 5-day forecast using a single query.
 * This query can be a city name, state, postal code, or coordinates.
 * The '/weather' and '/forecast' endpoints have a built-in, flexible geocoder.
 */
export const getWeatherAndForecast = async (params) => {
  // Common parameters for both API calls
  const config = {
    params: {
      ...params,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
    },
  };

  // Call both the current weather and forecast APIs in parallel
  const [weatherResponse, forecastResponse] = await Promise.all([
    axios.get(`${BASE_URL}/weather`, config),
    axios.get(`${BASE_URL}/forecast`, config)
  ]);

  // Check if both requests were successful
  if (weatherResponse.status === 200 && forecastResponse.status === 200) {
    return {
      weather: weatherResponse.data,
      forecast: forecastResponse.data.list,
    };
  } else {
    throw new Error('Failed to fetch weather data.');
  }
};

/**
 * Gets the location name from a pair of coordinates. This is still needed for the "My Location" button.
 */
export const reverseGeocode = async (lat, lon) => {
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse`, {
    params: { lat, lon, limit: 1, appid: OPENWEATHER_API_KEY },
  });
  if (response.data && response.data.length > 0) {
    return response.data[0];
  }
  throw new Error('Could not determine location from coordinates.');
};
