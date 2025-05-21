import styles from './PredictionResult.module.css';

export default function PredictionResult({ result }) {
  if (!result) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Flight Delay Prediction Result</h2>
      {result.status === 'success' ? (
        <p className={styles.message}>
          The flight is <strong>{result.prediction}</strong>.
          {result.prediction === 'delayed' && (
            <span> Estimated delay: {result.delay_minutes} minutes.</span>
          )}
        </p>
      ) : (
        <p className={styles.message}>Error: {result.message}</p>
      )}
    </div>
  );
}