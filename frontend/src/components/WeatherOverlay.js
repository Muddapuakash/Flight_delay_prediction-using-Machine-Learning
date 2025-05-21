import React from 'react';
import { FaTemperatureHigh, FaWind, FaCloud, FaUmbrella } from 'react-icons/fa';
import styles from '../styles/WeatherOverlay.module.css';

const WeatherOverlay = ({ weatherData, airportName }) => {
  if (!weatherData) return null;

  const current = weatherData.current;
  const hourly = weatherData.hourly;

  // Get weather icon based on weather code
  const getWeatherIcon = (code) => {
    if (code <= 3) return '☀️'; // Clear or mainly clear
    if (code <= 48) return '🌫️'; // Fog
    if (code <= 57) return '🌧️'; // Drizzle
    if (code <= 67) return '🌧️'; // Rain
    if (code <= 77) return '❄️'; // Snow
    if (code <= 82) return '🌧️'; // Rain showers
    if (code <= 86) return '❄️'; // Snow showers
    return '⛈️'; // Thunderstorm
  };

  // Get next 3 hours forecast
  const getNextHours = () => {
    const now = new Date().getHours();
    const startIndex = hourly.time.findIndex(time => new Date(time).getHours() > now);
    
    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const index = startIndex + i;
      if (index < hourly.time.length) {
        forecast.push({
          time: new Date(hourly.time[index]).getHours() + ':00',
          temp: Math.round(hourly.temperature_2m[index]),
          icon: getWeatherIcon(hourly.weather_code[index]),
          precipitation: hourly.precipitation_probability[index]
        });
      }
    }
    return forecast;
  };

  const forecast = getNextHours();

  return (
    <div className={styles.weatherOverlay}>
      <div className={styles.weatherHeader}>
        <h3 className={styles.locationName}>{airportName} Weather</h3>
        <div className={styles.currentWeather}>
          <div className={styles.tempDisplay}>
            <span className={styles.weatherIcon}>
              {getWeatherIcon(current.weather_code)}
            </span>
            <span className={styles.temperature}>
              {Math.round(current.temperature_2m)}°{weatherData.current_units.temperature_2m}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.weatherDetails}>
        <div className={styles.weatherDetail}>
          <FaWind className={styles.detailIcon} />
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Wind</span>
            <span className={styles.detailValue}>
              {Math.round(current.wind_speed_10m)} {weatherData.current_units.wind_speed_10m}
            </span>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <FaTemperatureHigh className={styles.detailIcon} />
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Temperature</span>
            <span className={styles.detailValue}>
              {Math.round(current.temperature_2m)}°{weatherData.current_units.temperature_2m}
            </span>
          </div>
        </div>

        <div className={styles.weatherDetail}>
          <FaCloud className={styles.detailIcon} />
          <div className={styles.detailText}>
            <span className={styles.detailLabel}>Cloud Cover</span>
            <span className={styles.detailValue}>
              {current.cloud_cover}% 
            </span>
          </div>
        </div>
      </div>

      <div className={styles.forecastSection}>
        <h4 className={styles.forecastTitle}>Hourly Forecast</h4>
        <div className={styles.forecast}>
          {forecast.map((hour, index) => (
            <div key={index} className={styles.forecastHour}>
              <div className={styles.forecastTime}>{hour.time}</div>
              <div className={styles.forecastIcon}>{hour.icon}</div>
              <div className={styles.forecastTemp}>{hour.temp}°</div>
              <div className={styles.forecastPrecip}>
                <FaUmbrella className={styles.precipIcon} /> {hour.precipitation}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherOverlay;
