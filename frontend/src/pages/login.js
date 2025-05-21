import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaPlane } from 'react-icons/fa';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setNotification({ message: data.message, type: 'error' });
      } else {
        // Store token in localStorage or a more secure method like httpOnly cookies
        localStorage.setItem('authToken', data.token);
        
        // Store user data in localStorage (optional)
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setNotification({ message: 'Login successful!', type: 'success' });
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setNotification({
        message: 'An error occurred during login. Please try again.',
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
          <h1 className={styles.title}>Flight Delay Predictor</h1>
        </div>
        <h2 className={styles.subtitle}>Sign In</h2>
        
        {notification && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            <p>{notification.message}</p>
            <button 
              className={styles.closeNotification}
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
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
              required
              className={styles.input}
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
              required
              className={styles.input}
            />
          </div>
          
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          <p>Don't have an account?</p>
          <Link href="/register" className={styles.authLink}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}