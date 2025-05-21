import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:5000';

// Get user's saved flights
export const getUserFlights = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/flights/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token for auth
      },
    });
    return response.data.flights; // Expected response: { flights: [{ id, flightNumber, origin, destination, departureTime, status }, ...] }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch flights');
  }
};

// Save a new flight for the user
export const saveFlight = async (userId, flightData) => {
  try {
    const response = await axios.post(
      `${API_URL}/flights/${userId}`,
      flightData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data; // Expected response: { message: "Flight saved successfully", flight: {...} }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save flight');
  }
};