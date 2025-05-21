import React from 'react';
import { FaPlane, FaRuler, FaClock } from 'react-icons/fa';
import styles from '../styles/FlightInfo.module.css';

const FlightInfo = ({ origin, destination, distance, duration }) => {
  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={styles.flightInfoContainer}>
      <div className={styles.flightRoute}>
        <div className={styles.airportCode}>{origin}</div>
        <div className={styles.flightPath}>
          <div className={styles.line}></div>
          <FaPlane className={styles.planeIcon} />
        </div>
        <div className={styles.airportCode}>{destination}</div>
      </div>
      
      <div className={styles.flightStats}>
        <div className={styles.stat}>
          <FaRuler className={styles.statIcon} />
          <div className={styles.statDetails}>
            <span className={styles.statLabel}>Distance</span>
            <span className={styles.statValue}>{distance} km</span>
          </div>
        </div>
        
        <div className={styles.stat}>
          <FaClock className={styles.statIcon} />
          <div className={styles.statDetails}>
            <span className={styles.statLabel}>Est. Flight Time</span>
            <span className={styles.statValue}>{formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightInfo;