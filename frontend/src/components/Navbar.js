import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaUser, FaSignOutAlt, FaHome, FaBuilding, FaPlane, FaMap, FaTachometerAlt, FaSignInAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    const isNextAuthAuthenticated = status === 'authenticated';
    const token = localStorage.getItem('authToken');
    const localStorageAuthenticated = !!token;

    // Retrieve user info safely
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      setUserInfo(null);
    }

    setIsAuthenticated(isNextAuthAuthenticated || localStorageAuthenticated);
  }, [session, status]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });

    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');

    setIsAuthenticated(false);
    setUserInfo(null);

    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <FaBuilding className={styles.logoIcon} />
          <span>Flight Delay Predictor</span>
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu}>
          <div className={styles.hamburger}>
            <span className={isMenuOpen ? styles.barActive : styles.bar}></span>
            <span className={isMenuOpen ? styles.barActive : styles.bar}></span>
            <span className={isMenuOpen ? styles.barActive : styles.bar}></span>
          </div>
        </button>

        <div className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
          <Link href="/" className={styles.navItem}>
            <FaHome className={styles.navIcon} />
            <span>Home</span>
          </Link>

          {/* Show authentication status in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <div className={styles.navItem} style={{ color: 'white' }}>
              Status: {isAuthenticated ? 'Authenticated' : 'Unauthenticated'}
            </div>
          )}

          {isAuthenticated ? (
            <>
              <Link href="/predict" className={styles.navItem}>
                <FaPlane className={styles.navIcon} />
                <span>Predict Delay</span>
              </Link>
              <Link href="/map" className={styles.navItem}>
                <FaMap className={styles.navIcon} />
                <span>Flight Map</span>
              </Link>
              <Link href="/dashboard" className={styles.navItem}>
                <FaTachometerAlt className={styles.navIcon} />
                <span>Dashboard</span>
              </Link>

              {/* Display user info if available */}
              {userInfo && (
                <div className={styles.userInfo}>
                  <FaUser className={styles.navIcon} />
                  <span>{userInfo.name || "User"}</span>
                </div>
              )}

              <button onClick={handleSignOut} className={styles.authButton}>
                <FaSignOutAlt className={styles.navIcon} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.authButton}>
              <FaSignInAlt className={styles.navIcon} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
