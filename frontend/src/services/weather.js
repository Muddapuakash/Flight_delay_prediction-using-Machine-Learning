import axios from 'axios';

// Replace with your OpenWeatherMap API key
const WEATHER_API_KEY = 'your-openweathermap-api-key';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (lat, lng) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat,
        lon: lng,
        appid: WEATHER_API_KEY,
        units: 'metric', // For Celsius
      },
    });
    return {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
  }
};