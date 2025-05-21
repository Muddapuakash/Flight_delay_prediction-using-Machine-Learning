import axios from 'axios';

// Base URL for the Flask backend
const API_URL = 'http://localhost:5000';

// Predict flight delay by calling the Flask backend
export const predictFlightDelay = async (flightData) => {
  try {
    const response = await axios.post(`${API_URL}/api/predict`, flightData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Expected response: { status, prediction, delay_minutes }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to predict flight delay');
  }
};