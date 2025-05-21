// utils/authMiddleware.js
import jwt from 'jsonwebtoken';

export function getAuthToken(req) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export function verifyAuth(req, res) {
  try {
    const token = getAuthToken(req);
    
    if (!token) {
      return { authorized: false, error: 'No token provided' };
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    return { authorized: true, user: decoded };
  } catch (error) {
    return { authorized: false, error: error.message };
  }
}

// Example of a protected API route
export function withAuth(handler) {
  return async (req, res) => {
    const auth = verifyAuth(req, res);
    
    if (!auth.authorized) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
}