import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaLock, FaPlane } from 'react-icons/fa';
import styles from '../styles/Register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return setNotification({
        message: 'Passwords do not match',
        type: 'error'
      });
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setNotification({
        message: 'Registration successful! Redirecting to login...',
        type: 'success'
      });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      setNotification({
        message: error.message || 'An error occurred during registration',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.logoContainer}>
          <FaPlane className={styles.logoIcon} />
          <h1 className={styles.logoText}>Flight Delay Predictor</h1>
        </div>

        <h2 className={styles.authTitle}>Create Account</h2>

        {notification && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            <p>{notification.message}</p>
            <button 
              className={styles.closeButton}
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaUser />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.authInput}
              required
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaLock />
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>Already have an account?</p>
          <Link href="/login" className={styles.authLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}