// pages/api/predict.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Forward the request to your Flask backend
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      // Get the response data
      const data = await response.json();
      
      // Return the data to the client
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error proxying request to Flask backend:', error);
      return res.status(500).json({ 
        error: 'Failed to connect to prediction service',
        details: error.message 
      });
    }
  }