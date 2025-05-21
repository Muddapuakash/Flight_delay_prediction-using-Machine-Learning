import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DateTimePicker.module.css';

export default function DateTimePicker({ label, selected, onChange }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        dateFormat="Pp"
        className={styles.datePicker}
      />
    </div>
  );
}