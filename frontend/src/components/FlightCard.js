import React from 'react';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock, Briefcase, Users, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import styles from './FlightCard.module.css';

const FlightCard = ({ flight }) => {
  const isPast = new Date(flight.departureDate) <= new Date();
  
  // Format dates
  const departureDate = new Date(flight.departureDate);
  const formattedDate = format(departureDate, 'MMM d, yyyy');
  const formattedTime = format(departureDate, 'h:mm a');
  
  return (
    <Card className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{flight.airline}</h3>
        <div className={isPast ? styles.tagPast : styles.tagUpcoming}>
          {isPast ? 'Past' : 'Upcoming'}
        </div>
      </div>
      
      <CardContent className={styles.flightInfo}>
        <div className={styles.flightRoute}>
          <div className={styles.flightCity}>
            <div className={styles.flightCityCode}>{flight.originCode}</div>
            <div className={styles.flightCityName}>{flight.origin}</div>
          </div>
          
          <ArrowRight className={styles.flightArrow} />
          
          <div className={styles.flightCity}>
            <div className={styles.flightCityCode}>{flight.destinationCode}</div>
            <div className={styles.flightCityName}>{flight.destination}</div>
          </div>
        </div>
        
        <div className={styles.flightDetails}>
          <div className={styles.flightDetail}>
            <Calendar className={styles.flightDetailIcon} size={16} />
            <span>{formattedDate}</span>
          </div>
          
          <div className={styles.flightDetail}>
            <Clock className={styles.flightDetailIcon} size={16} />
            <span>{formattedTime}</span>
          </div>
          
          <div className={styles.flightDetail}>
            <Briefcase className={styles.flightDetailIcon} size={16} />
            <span>Flight {flight.flightNumber}</span>
          </div>
          
          {flight.passengers && (
            <div className={styles.flightDetail}>
              <Users className={styles.flightDetailIcon} size={16} />
              <span>{flight.passengers} passengers</span>
            </div>
          )}
          
          {flight.price && (
            <div className={styles.flightDetail}>
              <CreditCard className={styles.flightDetailIcon} size={16} />
              <span>${flight.price.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <div className={styles.flightActions}>
        <button className="text-sm text-blue-600 hover:underline">View Details</button>
        {!isPast && (
          <button className="text-sm text-slate-600 hover:underline">Manage</button>
        )}
      </div>
    </Card>
  );
};

export default FlightCard;