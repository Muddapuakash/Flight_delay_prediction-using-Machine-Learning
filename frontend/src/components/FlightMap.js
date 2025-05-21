import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './FlightMap.module.css';

// Fix for Leaflet marker icons not displaying correctly in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function FlightMap({ origin, destination, airports, mapStyle = 'default' }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeLine = useRef(null);
  const originMarker = useRef(null);
  const destinationMarker = useRef(null);
  const planeMarker = useRef(null);
  const [error, setError] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = L.map(mapContainer.current).setView([37.0902, -95.7129], 3); // Center of USA

      // Add tile layer based on map style
      const tileLayerOptions = {
        default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      };

      const attributions = {
        default: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        satellite: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      };

      const tileUrl = tileLayerOptions[mapStyle] || tileLayerOptions.default;
      const attribution = attributions[mapStyle] || attributions.default;

      L.tileLayer(tileUrl, {
        attribution: attribution,
        maxZoom: 19
      }).addTo(map.current);

      // Add scale control
      L.control.scale({
        imperial: true,
        metric: true
      }).addTo(map.current);

      // Clean up on unmount
      return () => {
        if (map.current) map.current.remove();
      };
    } catch (err) {
      setError(`Error initializing map: ${err.message}`);
    }
  }, []);

  // Update map style when it changes
  useEffect(() => {
    if (map.current) {
      try {
        // Remove existing tile layers
        map.current.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            map.current.removeLayer(layer);
          }
        });

        // Add new tile layer based on map style
        const tileLayerOptions = {
          default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        };

        const attributions = {
          default: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          satellite: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          light: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        };

        const tileUrl = tileLayerOptions[mapStyle] || tileLayerOptions.default;
        const attribution = attributions[mapStyle] || attributions.default;

        L.tileLayer(tileUrl, {
          attribution: attribution,
          maxZoom: 19
        }).addTo(map.current);
      } catch (err) {
        setError(`Error updating map style: ${err.message}`);
      }
    }
  }, [mapStyle]);

  // Update flight route when airports change
  useEffect(() => {
    if (!map.current) return;
    
    // Validate airport data
    if (!airports) {
      setError("Airport data is missing");
      return;
    }
    
    // Check if airports are valid JSON objects
    try {
      // If airports is a string, try to parse it
      if (typeof airports === 'string') {
        const parsedAirports = JSON.parse(airports);
        // Continue with parsed airports
        console.log(parsedAirports);
      }
    } catch (err) {
      setError(`Invalid airport data: ${err.message}`);
      return;
    }
    
    if (!airports[origin]) {
      setError(`Origin airport '${origin}' not found in airport data`);
      return;
    }
    
    if (!airports[destination]) {
      setError(`Destination airport '${destination}' not found in airport data`);
      return;
    }

    try {
      // Remove existing markers and lines
      if (originMarker.current) map.current.removeLayer(originMarker.current);
      if (destinationMarker.current) map.current.removeLayer(destinationMarker.current);
      if (routeLine.current) map.current.removeLayer(routeLine.current);
      if (planeMarker.current) map.current.removeLayer(planeMarker.current);

      const originCoords = [airports[origin].lat, airports[origin].lng]; // Note: Leaflet uses [lat, lng]
      const destinationCoords = [airports[destination].lat, airports[destination].lng];

      // Create custom icon for markers
      const createCustomIcon = (type, airportCode) => {
        return L.divIcon({
          html: `<div class="${styles.markerCode}">${airportCode}</div>`,
          className: `${styles.customMarker} ${type === 'origin' ? styles.originMarker : styles.destinationMarker}`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      };

      // Add markers
      originMarker.current = L.marker(originCoords, {
        icon: createCustomIcon('origin', origin)
      })
      .bindPopup(`${origin} - ${airports[origin].name}`)
      .addTo(map.current);

      destinationMarker.current = L.marker(destinationCoords, {
        icon: createCustomIcon('destination', destination)
      })
      .bindPopup(`${destination} - ${airports[destination].name}`)
      .addTo(map.current);

      // Calculate the great circle route
      const routeCoords = calculateGreatCircle(
        [airports[origin].lng, airports[origin].lat], 
        [airports[destination].lng, airports[destination].lat]
      );
      
      // Convert to Leaflet format
      const leafletRouteCoords = routeCoords.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      // Create route line with styling
      routeLine.current = L.polyline(leafletRouteCoords, {
        color: '#3498db',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 10',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map.current);
      
      // Create a glow effect with a second line
      L.polyline(leafletRouteCoords, {
        color: '#73b6e6',
        weight: 6,
        opacity: 0.4,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map.current);

      // Fit the map to the route
      map.current.fitBounds(routeLine.current.getBounds(), {
        padding: [100, 100],
        maxZoom: 9
      });

      // Create plane icon for animation
      const planeIcon = L.divIcon({
        html: `<div class="${styles.planeIcon}">✈️</div>`,
        className: styles.planeMarker,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Add plane marker
      planeMarker.current = L.marker(leafletRouteCoords[0], {
        icon: planeIcon,
        rotationAngle: getBearing(
          [leafletRouteCoords[0][1], leafletRouteCoords[0][0]],
          [leafletRouteCoords[1][1], leafletRouteCoords[1][0]]
        )
      }).addTo(map.current);

      // Start animation
      animatePlane(leafletRouteCoords, 0);
    } catch (err) {
      setError(`Error updating flight route: ${err.message}`);
    }
  }, [airports, origin, destination]);

  // Calculate a great circle route between two points
  const calculateGreatCircle = (start, end) => {
    try {
      // Generate points along the great circle
      const points = 100;
      const coordinates = [];
      
      // Convert to radians
      const startLat = start[1] * Math.PI / 180;
      const startLng = start[0] * Math.PI / 180;
      const endLat = end[1] * Math.PI / 180;
      const endLng = end[0] * Math.PI / 180;
      
      for (let i = 0; i <= points; i++) {
        const fraction = i / points;
        
        // Use spherical interpolation
        const A = Math.sin((1 - fraction) * Math.PI) / Math.sin(Math.PI);
        const B = Math.sin(fraction * Math.PI) / Math.sin(Math.PI);
        
        // Calculate the x, y, z coordinates
        const x = A * Math.cos(startLat) * Math.cos(startLng) + B * Math.cos(endLat) * Math.cos(endLng);
        const y = A * Math.cos(startLat) * Math.sin(startLng) + B * Math.cos(endLat) * Math.sin(endLng);
        const z = A * Math.sin(startLat) + B * Math.sin(endLat);
        
        // Convert back to latitude and longitude
        const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
        const lng = Math.atan2(y, x) * 180 / Math.PI;
        
        coordinates.push([lng, lat]);
      }
      
      return {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        }
      };
    } catch (err) {
      setError(`Error calculating route: ${err.message}`);
      // Return a minimal valid GeoJSON feature
      return {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [start, end]
        }
      };
    }
  };

  // Calculate bearing between two points
  const getBearing = (start, end) => {
    try {
      // Convert to radians
      const startLat = start[1] * Math.PI / 180;
      const startLng = start[0] * Math.PI / 180;
      const endLat = end[1] * Math.PI / 180;
      const endLng = end[0] * Math.PI / 180;
      
      const y = Math.sin(endLng - startLng) * Math.cos(endLat);
      const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
      const bearing = Math.atan2(y, x) * 180 / Math.PI;
      
      return (bearing + 360) % 360;
    } catch (err) {
      console.error("Error calculating bearing:", err);
      return 0; // Default bearing
    }
  };

  // Animate the plane along the route
  const animatePlane = (routeCoords, step) => {
    if (!map.current || !planeMarker.current || !routeCoords || routeCoords.length === 0) return;
    
    if (step >= routeCoords.length - 1) {
      step = 0; // Reset to beginning
    }
    
    try {
      // Update plane position
      planeMarker.current.setLatLng(routeCoords[step]);
      
      // Update plane rotation
      const nextStep = step + 1 < routeCoords.length ? step + 1 : 0;
      if (typeof planeMarker.current.setRotationAngle === 'function') {
        const bearing = getBearing(
          [routeCoords[step][1], routeCoords[step][0]],
          [routeCoords[nextStep][1], routeCoords[nextStep][0]]
        );
        planeMarker.current.setRotationAngle(bearing);
      }
      
      // Request next frame
      setTimeout(() => {
        animatePlane(routeCoords, step + 1);
      }, 50); // Control animation speed
    } catch (err) {
      // Silent fail for animation errors
      console.error("Animation error:", err);
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <div ref={mapContainer} className={styles.mapContainer} />
    </div>
  );
}