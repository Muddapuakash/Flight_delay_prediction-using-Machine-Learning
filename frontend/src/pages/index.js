import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  
  // Handle scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
     
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Predict Your Flight Delays
            <span className={styles.heroSubtitle}>With AI-Powered Precision</span>
          </h1>
          
          <p className={styles.heroDescription}>
            Our advanced machine learning model combines real-time data and historical patterns
            to provide the most accurate predictions, helping you plan your journey with confidence.
          </p>
          
          <div className={styles.heroCta}>
            <Link href="/predict">
              <button className={styles.primaryButton}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
                Get Started
              </button>
            </Link>
            
            <Link href="/how-it-works">
              <button className={styles.outlineButton}>
                How It Works
              </button>
            </Link>
          </div>
        </div>
        
        {/* Animated Plane with Cloud Background */}
        <div className={styles.heroVisual}>
          <div className={styles.clouds}>
            <div className={`${styles.cloud} ${styles.cloud1}`}></div>
            <div className={`${styles.cloud} ${styles.cloud2}`}></div>
            <div className={`${styles.cloud} ${styles.cloud3}`}></div>
          </div>
          
          <div className={styles.planeContainer}>
            <svg className={styles.plane} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.59 13.58L21 8L22 10L13 16L12 19L9 16L4 17.5L3 16L9.59 13.58Z" fill="currentColor" />
              <path opacity="0.3" d="M9.59 13.58L5 17.5L4 17.5L3 16L9.59 13.58Z" fill="currentColor" />
            </svg>
            
            <div className={styles.planeTrail}></div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className={styles.trustedBySection}>
        <div className={styles.trustedByContent}>
          <p className={styles.trustedByTitle}>Trusted by travelers worldwide</p>
          <div className={styles.trustedByLogos}>
            <div className={styles.logoItem}>AirlineOne</div>
            <div className={styles.logoItem}>TravelAgency</div>
            <div className={styles.logoItem}>SkyPartners</div>
            <div className={styles.logoItem}>FlightBooker</div>
            <div className={styles.logoItem}>TripPlanner</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresSectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.featuresTitle}>Why Choose Our Flight Predictor</h2>
            <p className={styles.featuresSubtitle}>Our platform combines advanced technology with user-friendly design</p>
          </div>
          
          <div className={styles.featuresGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>AI-Powered Predictions</h3>
              <p className={styles.featureDescription}>Our model combines Random Forest, XGBoost, and Deep Learning algorithms for 95% accuracy in predicting delays.</p>
            </div>
            
            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Interactive Map</h3>
              <p className={styles.featureDescription}>Visualize flight routes on an interactive 3D map with real-time weather data and delay probabilities.</p>
            </div>
            
            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>User-Friendly</h3>
              <p className={styles.featureDescription}>Simple and intuitive interface that works on any device, allowing you to get predictions in seconds.</p>
            </div>
            
            {/* Feature 4 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Real-Time Updates</h3>
              <p className={styles.featureDescription}>Get instant notifications about changing flight conditions and updated predictions as your travel date approaches.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.howItWorksTitle}>How It Works</h2>
          <p className={styles.howItWorksSubtitle}>Get predictions in three simple steps</p>
        </div>
        
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Enter Flight Details</h3>
            <p className={styles.stepDescription}>Input your flight number, date, and time in our simple form</p>
          </div>
          
          <div className={styles.stepConnector}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>AI Analysis</h3>
            <p className={styles.stepDescription}>Our algorithms analyze historical data, weather patterns, and airport congestion</p>
          </div>
          
          <div className={styles.stepConnector}></div>
          
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Get Your Prediction</h3>
            <p className={styles.stepDescription}>Receive accurate delay predictions and recommendations</p>
          </div>
        </div>
      </section>
      
      {/* Statistics Section with Animation */}
      <section className={styles.statsSection}>
        <div className={styles.statsWave}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,197.3C960,213,1056,203,1152,170.7C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className={styles.statsContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Prediction Accuracy</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Daily Users</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1M+</div>
              <div className={styles.statLabel}>Flights Analyzed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>200+</div>
              <div className={styles.statLabel}>Airlines Covered</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.testimonialsTitle}>What Our Users Say</h2>
          <p className={styles.testimonialsSubtitle}>Join thousands of satisfied travelers</p>
        </div>
        
        <div className={styles.testimonialsSlider}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>"This app saved me hours of waiting at the airport. The prediction was spot on!"</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}></div>
              <div className={styles.testimonialInfo}>
                <h4>Sarah Johnson</h4>
                <p>Frequent Flyer</p>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>"As a business traveler, this tool has become essential for planning my schedule."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}></div>
              <div className={styles.testimonialInfo}>
                <h4>Mark Thompson</h4>
                <p>Business Consultant</p>
              </div>
            </div>
          </div>
          
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <p>"The interactive map feature is amazing! I can see all potential delays at a glance."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}></div>
              <div className={styles.testimonialInfo}>
                <h4>Emma Rodriguez</h4>
                <p>Travel Blogger</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Parallax Effect */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaParallax}></div>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Plan Your Trip With Confidence?</h2>
          <p className={styles.ctaDescription}>Join over 50,000 travelers who make informed decisions with our predictions.</p>
          <div className={styles.ctaButtons}>
            <Link href="/predict">
              <button className={styles.primaryButton}>
                Try It Now - Free
              </button>
            </Link>
            <Link href="/pricing">
              <button className={styles.secondaryButton}>
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Modern Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.footerLogoIcon}>✈️</span>
            <span className={styles.footerLogoText}>FlightPredictor</span>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h3>Product</h3>
              <ul>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/api">API</Link></li>
                <li><Link href="/integrations">Integrations</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h3>Resources</h3>
              <ul>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/tutorials">Tutorials</Link></li>
                <li><Link href="/documentation">Documentation</Link></li>
                <li><Link href="/community">Community</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerColumn}>
              <h3>Legal</h3>
              <ul>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© {currentYear} FlightPredictor. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" width="24" height="24"></svg></a>
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="24" height="24"></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="24" height="24"></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="24" height="24"></svg></a>
          </div>
        </div>
      </footer>
    </div>
  );
}