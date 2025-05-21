import axios from 'axios';

// Base URL for the backend API (adjust this to match your Flask backend)
const API_URL = 'http://localhost:5000';

// Login user (used with NextAuth credentials provider)
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data && response.data.user) {
      return response.data.user; // Return user data for NextAuth
    }
    throw new Error('Invalid login response');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};