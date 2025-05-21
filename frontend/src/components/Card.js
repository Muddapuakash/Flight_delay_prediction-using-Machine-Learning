import { motion } from 'framer-motion';
import styles from './Card.module.css';

export default function Card({ title, description, icon }) {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </motion.div>
  );
}