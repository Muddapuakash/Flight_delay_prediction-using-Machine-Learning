import { useEffect } from 'react';
import styles from './Notification.module.css';

export default function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>×</button>
    </div>
  );
}