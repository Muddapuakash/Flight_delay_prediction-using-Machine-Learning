// FlightPredictor.js
import { useState } from 'react';
import styles from '../styles/FlightPredictor.module.css';

export default function FlightPredictor() {
  const [formData, setFormData] = useState({
    DayOfWeek: 1,
    DepHour: 12,
    Distance: '',
    TaxiOut: '',
    UniqueCarrier: 'AA',
    Origin: 'JFK',
    Dest: 'LAX',
    TaxiIn: 10,
    CRSElapsedTime: '',
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const numericFields = ['DayOfWeek', 'DepHour', 'Distance', 'TaxiOut', 'TaxiIn', 'CRSElapsedTime'];
    const processedValue = numericFields.includes(id) && value !== '' ? parseFloat(value) : value;

    setFormData({
      ...formData,
      [id]: processedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      CRSElapsedTime: formData.CRSElapsedTime || formData.Distance / 8,
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPredictionResult(data);
      }
    } catch (err) {
      setError('Error connecting to prediction server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'ON_TIME') {
      return (
        <svg className={styles.statusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (status === 'MINOR_DELAY' || status === 'SIGNIFICANT_DELAY') {
      return (
        <svg className={styles.statusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (status === 'CANCELLED') {
      return (
        <svg className={styles.statusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    } else {
      return (
        <svg className={styles.statusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className={styles.flightPredictorContainer}>
      <h1 className={styles.title}>Flight Status Predictor</h1>

      <form onSubmit={handleSubmit} className={styles.flightForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="DayOfWeek">Day of Week (1-7)</label>
            <input type="number" id="DayOfWeek" min="1" max="7" value={formData.DayOfWeek} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="DepHour">Departure Hour (0-23)</label>
            <input type="number" id="DepHour" min="0" max="23" value={formData.DepHour} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Distance">Distance (miles)</label>
            <input type="number" id="Distance" min="0" step="0.1" value={formData.Distance} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="TaxiOut">Taxi Out Time (minutes)</label>
            <input type="number" id="TaxiOut" min="0" step="0.1" value={formData.TaxiOut} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="UniqueCarrier">Airline Code</label>
            <input type="text" id="UniqueCarrier" value={formData.UniqueCarrier} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Origin">Origin Airport</label>
            <input type="text" id="Origin" value={formData.Origin} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="Dest">Destination Airport</label>
            <input type="text" id="Dest" value={formData.Dest} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="TaxiIn">Taxi In Time (minutes)</label>
            <input type="number" id="TaxiIn" min="0" step="0.1" value={formData.TaxiIn} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="CRSElapsedTime">Scheduled Flight Time (optional)</label>
            <input type="number" id="CRSElapsedTime" min="0" step="0.1" value={formData.CRSElapsedTime} onChange={handleChange} />
            <p className={styles.helperText}>If empty, calculated as Distance/8</p>
          </div>
        </div>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Predicting...' : 'Predict Flight Status'}
        </button>
      </form>

      {error && (
        <div className={styles.errorMessage}>
          <p className={styles.errorTitle}>Error</p>
          <p>{error}</p>
        </div>
      )}

      {predictionResult && !error && (
        <div className={`${styles.predictionResult} ${styles[predictionResult.status.toLowerCase()]}`}>
          <div className={styles.predictionHeader}>
            <StatusIcon status={predictionResult.status} />
            <h2>{predictionResult.message}</h2>
          </div>
          <div className={styles.predictionDetails}>
            <div className={styles.infoBox}>
              <p className={styles.infoLabel}>Flight Details</p>
              <p>{predictionResult.flight_info.carrier} {predictionResult.flight_info.origin} → {predictionResult.flight_info.destination}</p>
              <p>Scheduled Duration: {Math.round(predictionResult.flight_info.scheduled_duration)} minutes</p>
            </div>
            <div className={styles.infoBox}>
              <p className={styles.infoLabel}>Prediction Details</p>
              <p>Delay Probability: {predictionResult.probability_of_delay.toFixed(1)}%</p>
              {predictionResult.delay_minutes !== null && (
                <p>Estimated Delay: {predictionResult.delay_minutes} minutes</p>
              )}
            </div>
          </div>
          <div className={styles.probabilityBar}>
            <div className={styles.barContainer}>
              <div
                className={styles.barFill}
                style={{ width: `${Math.min(100, predictionResult.probability_of_delay)}%` }}
              ></div>
            </div>
            <div className={styles.barLabels}>
              <span>On Time</span>
              <span>Delayed</span>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}