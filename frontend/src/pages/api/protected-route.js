// pages/api/protected-route.js
import { withAuth } from '../../utils/authMiddleware';
import { MongoClient } from 'mongodb';

async function handler(req, res) {
  // This route is protected by withAuth middleware
  // req.user contains the authenticated user info
  
  let client;
  try {
    client = await MongoClient.connect(
      'mongodb://localhost:27017/flightpredictor',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    
    const db = client.db();
    
    // Example: Get user's profile data
    const userData = await db.collection('users').findOne(
      { _id: req.user.userId },
      { projection: { password: 0 } } // Exclude password
    );
    
    res.status(200).json(userData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    if (client) {
      client.close();
    }
  }
}

// Wrap the handler with the authentication middleware
export default withAuth(handler);