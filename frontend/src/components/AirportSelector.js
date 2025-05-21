import React from 'react';
import styles from '../styles/AirportSelector.module.css';

const AirportSelector = ({ label, value, onChange, airports, icon }) => {
  return (
    <div className={styles.selectorContainer}>
      <label className={styles.label}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {label}
      </label>
      <select
        className={styles.select}
        value={value}
        onChange={onChange}
      >
        {Object.keys(airports).length > 0 ? (
          Object.entries(airports).map(([code, airport]) => (
            <option key={code} value={code}>
              {airport.name} ({code})
            </option>
          ))
        ) : (
          <option value="">Loading airports...</option>
        )}
      </select>
    </div>
  );
};

export default AirportSelector;