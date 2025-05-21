import { motion } from 'framer-motion';
import styles from './Button.module.css';

export default function Button({ children, onClick, disabled, type = 'button' }) {
  return (
    <motion.button
      type={type}
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}