import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaPlane, FaExchangeAlt, FaCloudSun, FaMapMarkedAlt } from 'react-icons/fa';
import styles from '../styles/Map.module.css';

// Dynamically import FlightMap with SSR disabled
const FlightMap = dynamic(() => import('../components/FlightMap'), {
  ssr: false, // Disable SSR for this component
  loading: () => (
    <div className={styles.mapLoading}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading Map...</p>
    </div>
  ),
});

export default function Map() {
  const [airports, setAirports] = useState({});
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('LAX');
  const [loading, setLoading] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [mapStyle, setMapStyle] = useState('streets-v11');
  
  // Available map styles from Mapbox (free to use)
  const mapStyles = [
    { id: 'streets-v11', name: 'Streets' },
    { id: 'light-v10', name: 'Light' },
    { id: 'dark-v10', name: 'Dark' },
    { id: 'satellite-v9', name: 'Satellite' },
    { id: 'satellite-streets-v11', name: 'Satellite Streets' }
  ];

  useEffect(() => {
    // Fetch airport data
    setLoading(true);
    fetch('/airport-data/airports.json')
      .then((res) => res.json())
      .then((data) => {
        setAirports(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch airport data:", err);
        setLoading(false);
      });
  }, []);

  const swapAirports = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const getFlightDistance = () => {
    if (!airports[origin] || !airports[destination]) return null;
    
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const lat1 = airports[origin].lat * Math.PI / 180;
    const lat2 = airports[destination].lat * Math.PI / 180;
    const dLat = (airports[destination].lat - airports[origin].lat) * Math.PI / 180;
    const dLon = (airports[destination].lng - airports[origin].lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Convert to miles
    const miles = distance * 0.621371;
    
    return {
      km: Math.round(distance),
      miles: Math.round(miles)
    };
  };

  // Calculate estimated flight time (basic calculation)
  const getEstimatedFlightTime = () => {
    const distance = getFlightDistance();
    if (!distance) return null;
    
    // Average commercial flight speed ~500 mph + 30 min for takeoff/landing
    const flightHours = distance.miles / 500;
    const totalMinutes = Math.round(flightHours * 60 + 30);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaMapMarkedAlt className={styles.titleIcon} />
          Flight Route Map
        </h1>
        
        {!loading && airports[origin] && airports[destination] && (
          <div className={styles.flightInfo}>
            <div className={styles.flightDistance}>
              <span className={styles.flightInfoLabel}>Distance:</span>
              <span className={styles.flightInfoValue}>
                {getFlightDistance()?.miles.toLocaleString()} mi / {getFlightDistance()?.km.toLocaleString()} km
              </span>
            </div>
            <div className={styles.flightTime}>
              <span className={styles.flightInfoLabel}>Est. Flight Time:</span>
              <span className={styles.flightInfoValue}>{getEstimatedFlightTime()}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.controls}>
        <div className={styles.airportSelectors}>
          <div className={styles.airportSelector}>
            <label className={styles.airportLabel}>
              <FaPlane className={styles.airportIcon} style={{ transform: 'rotate(-45deg)' }} />
              Origin:
            </label>
            <select 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              className={styles.airportSelect}
            >
              {Object.keys(airports).map(code => (
                <option key={`origin-${code}`} value={code}>
                  {code} - {airports[code]?.name}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className={styles.swapButton} 
            onClick={swapAirports}
            aria-label="Swap airports"
          >
            <FaExchangeAlt />
          </button>
          
          <div className={styles.airportSelector}>
            <label className={styles.airportLabel}>
              <FaPlane className={styles.airportIcon} style={{ transform: 'rotate(45deg)' }} />
              Destination:
            </label>
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className={styles.airportSelect}
            >
              {Object.keys(airports).map(code => (
                <option key={`dest-${code}`} value={code}>
                  {code} - {airports[code]?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.mapControls}>
          <div className={styles.mapStyleSelector}>
            <label className={styles.controlLabel}>Map Style:</label>
            <select 
              value={mapStyle} 
              onChange={(e) => setMapStyle(e.target.value)}
              className={styles.controlSelect}
            >
              {mapStyles.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.weatherToggle}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={showWeather}
                onChange={() => setShowWeather(!showWeather)}
                className={styles.toggleCheckbox}
              />
              <span className={styles.toggleSwitch}></span>
              <FaCloudSun className={styles.weatherIcon} /> Weather
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.mapContainer}>
        <div className={styles.mapWrapper}>
          {loading ? (
            <div className={styles.mapLoading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading Airport Data...</p>
            </div>
          ) : (
            <FlightMap 
              origin={origin} 
              destination={destination} 
              airports={airports} 
              mapStyle={mapStyle}
            />
          )}
        </div>
        
        {/* Weather widgets positioned below the map */}
        {!loading && showWeather && airports[origin] && airports[destination] && (
          <div className={styles.weatherContainer}>
            <WeatherWidget 
              lat={airports[origin].lat}
              lng={airports[origin].lng}
              airportName={airports[origin].name}
              airportCode={origin}
              type="origin"
            />
            
            <WeatherWidget 
              lat={airports[destination].lat}
              lng={airports[destination].lng}
              airportName={airports[destination].name}
              airportCode={destination}
              type="destination"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Weather Widget component using free weather API
function WeatherWidget({ lat, lng, airportName, airportCode, type }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Using Open-Meteo API - free without API key
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch weather:", err);
        setError("Unable to load weather data");
        setLoading(false);
      });
  }, [lat, lng]);

  // Convert weather code to icon and description
  const getWeatherInfo = (code) => {
    // Weather codes from Open-Meteo
    if (code === 0) return { icon: "☀️", description: "Clear sky" };
    if (code === 1) return { icon: "🌤️", description: "Mainly clear" };
    if (code === 2) return { icon: "⛅", description: "Partly cloudy" };
    if (code === 3) return { icon: "☁️", description: "Overcast" };
    if (code <= 49) return { icon: "🌫️", description: "Fog" };
    if (code <= 59) return { icon: "🌧️", description: "Drizzle" };
    if (code <= 69) return { icon: "🌧️", description: "Rain" };
    if (code <= 79) return { icon: "🌨️", description: "Snow" };
    if (code <= 99) return { icon: "⛈️", description: "Thunderstorm" };
    return { icon: "❓", description: "Unknown" };
  };

  const getWindDirection = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className={`${styles.weatherWidget} ${styles[type]}`}>
      <div className={styles.weatherHeader}>
        <h3>{airportCode}</h3>
        <span className={styles.airportName}>{airportName}</span>
      </div>
      
      {loading ? (
        <div className={styles.weatherLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading weather...</p>
        </div>
      ) : error ? (
        <div className={styles.weatherError}>{error}</div>
      ) : weather ? (
        <div className={styles.weatherData}>
          <div className={styles.weatherIcon}>
            {getWeatherInfo(weather.current.weather_code).icon}
          </div>
          <div className={styles.weatherDetails}>
            <div className={styles.temperature}>
              {Math.round(weather.current.temperature_2m)}°F
              <span className={styles.feelsLike}>
                Feels like {Math.round(weather.current.apparent_temperature)}°F
              </span>
            </div>
            <div className={styles.weatherDescription}>
              {getWeatherInfo(weather.current.weather_code).description}
            </div>
            <div className={styles.weatherStats}>
              <div className={styles.weatherStat}>
                <span className={styles.statLabel}>Wind:</span>
                <span className={styles.statValue}>
                  {Math.round(weather.current.wind_speed_10m)} mph {getWindDirection(weather.current.wind_direction_10m)}
                </span>
              </div>
              <div className={styles.weatherStat}>
                <span className={styles.statLabel}>Humidity:</span>
                <span className={styles.statValue}>{weather.current.relative_humidity_2m}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}