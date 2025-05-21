// pages/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const [pastFlights, setPastFlights] = useState([]);  // Fixed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFlights: 0,
    upcomingFlights: 0,
    totalMiles: 0,
    mostVisitedCity: ''
  });

  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      const mockFlights = [
        {
          id: 1,
          flightNumber: 'AA1234',
          origin: 'New York (JFK)',
          destination: 'London (LHR)',
          departureDate: '2025-05-15T08:30:00',
          arrivalDate: '2025-05-15T20:45:00',
          airline: 'American Airlines',
          price: 750,
          miles: 3458,
          status: 'Confirmed'
        },
        {
          id: 2,
          flightNumber: 'DL456',
          origin: 'San Francisco (SFO)',
          destination: 'Tokyo (HND)',
          departureDate: '2025-06-10T23:15:00',
          arrivalDate: '2025-06-12T05:20:00',
          airline: 'Delta Airlines',
          price: 1240,
          miles: 5124,
          status: 'Confirmed'
        },
        {
          id: 3,
          flightNumber: 'UA789',
          origin: 'Chicago (ORD)',
          destination: 'Paris (CDG)',
          departureDate: '2025-01-20T16:45:00',
          arrivalDate: '2025-01-21T08:10:00',
          airline: 'United Airlines',
          price: 890,
          miles: 4098,
          status: 'Completed'
        }
      ];
      
      setFlights(mockFlights);
      
      // Separate upcoming and past flights
      const now = new Date();
      const upcoming = mockFlights.filter(flight => new Date(flight.departureDate) > now);
      const past = mockFlights.filter(flight => new Date(flight.departureDate) <= now);
      
      setUpcomingFlights(upcoming);
      setPastFlights(past);
      
      // Calculate stats
      setStats({
        totalFlights: mockFlights.length,
        upcomingFlights: upcoming.length,
        totalMiles: mockFlights.reduce((total, flight) => total + (flight.miles || 0), 0),
        mostVisitedCity: getMostFrequentCity(mockFlights)
      });
      
      setIsLoading(false);
    }, 1500);
  }, []);

  // Helper function to get most visited city
  const getMostFrequentCity = (flights) => {
    if (!flights.length) return 'None';
    const cityCounts = {};
    flights.forEach(flight => {
      const destination = flight.destination.split(' ')[0]; // Extract city name
      cityCounts[destination] = (cityCounts[destination] || 0) + 1;
    });
    return Object.keys(cityCounts).reduce((a, b) => 
      cityCounts[a] > cityCounts[b] ? a : b, Object.keys(cityCounts)[0]);
  };

  // Filter flights based on search term and active tab
  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'upcoming') return matchesSearch && new Date(flight.departureDate) > new Date();
    if (activeTab === 'past') return matchesSearch && new Date(flight.departureDate) <= new Date();
    return matchesSearch;
  });

  // Sort flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.departureDate) - new Date(a.departureDate);
    } else if (sortBy === 'destination') {
      return a.destination.localeCompare(b.destination);
    } else if (sortBy === 'price') {
      return (b.price || 0) - (a.price || 0);
    }
    return 0;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.icon}>✈️</div>
          <p>Loading your flight dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Flight Dashboard</title>
        <meta name="description" content="Track your flights and travel plans" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Welcome, Traveler!</h1>
          <p className={styles.subtitle}>Manage your flight itineraries and travel plans in one place</p>
        </div>
        <div>
          <button className={styles.addButton}>
            <span>+</span> Add New Flight
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconContainer} ${styles.blue}`}>
              <span>✈️</span>
            </div>
            <div>
              <p className={styles.statLabel}>Total Flights</p>
              <h3 className={styles.statValue}>{stats.totalFlights}</h3>
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconContainer} ${styles.green}`}>
              <span>🗓️</span>
            </div>
            <div>
              <p className={styles.statLabel}>Upcoming Trips</p>
              <h3 className={styles.statValue}>{stats.upcomingFlights}</h3>
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconContainer} ${styles.purple}`}>
              <span>🗺️</span>
            </div>
            <div>
              <p className={styles.statLabel}>Total Miles</p>
              <h3 className={styles.statValue}>{stats.totalMiles.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={`${styles.iconContainer} ${styles.amber}`}>
              <span>📌</span>
            </div>
            <div>
              <p className={styles.statLabel}>Most Visited</p>
              <h3 className={styles.statValue}>{stats.mostVisitedCity}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filter Controls */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsAndFilters}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`} 
              onClick={() => setActiveTab('all')}
            >
              All Flights
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'past' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Flights
            </button>
          </div>
          
          <div className={styles.filterControls}>
            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search flights..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="destination">Sort by Destination</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        <div className={styles.flightGrid}>
          {sortedFlights.length > 0 ? (
            sortedFlights.map((flight) => (
              <div key={flight.id} className={styles.flightCard}>
                <div className={styles.flightCardHeader}>
                  <div className={styles.flightAirline}>{flight.airline}</div>
                  <div className={styles.flightNumber}>{flight.flightNumber}</div>
                </div>
                
                <div className={styles.flightRoute}>
                  <div className={styles.flightOrigin}>
                    <div className={styles.flightCity}>{flight.origin.split(' ')[0]}</div>
                    <div className={styles.flightCode}>{flight.origin.match(/\(([^)]+)\)/)[1]}</div>
                  </div>
                  
                  <div className={styles.flightArrow}>→</div>
                  
                  <div className={styles.flightDestination}>
                    <div className={styles.flightCity}>{flight.destination.split(' ')[0]}</div>
                    <div className={styles.flightCode}>{flight.destination.match(/\(([^)]+)\)/)[1]}</div>
                  </div>
                </div>
                
                <div className={styles.flightDetails}>
                  <div className={styles.flightDate}>
                    <span className={styles.flightLabel}>Date</span>
                    <span>{formatDate(flight.departureDate)}</span>
                  </div>
                  
                  <div className={styles.flightTime}>
                    <span className={styles.flightLabel}>Time</span>
                    <span>{formatTime(flight.departureDate)}</span>
                  </div>
                  
                  <div className={styles.flightPrice}>
                    <span className={styles.flightLabel}>Price</span>
                    <span>${flight.price}</span>
                  </div>
                </div>
                
                <div className={styles.flightActions}>
                  <button className={styles.flightActionButton}>View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>✈️</div>
              <h3 className={styles.emptyStateTitle}>No flights found</h3>
              <p className={styles.emptyStateText}>
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first flight"}
              </p>
              {!searchTerm && (
                <button className={styles.addButton}>
                  <span>+</span> Add Flight
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}