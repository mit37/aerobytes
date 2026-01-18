const app = require('../server');

// Export as Vercel serverless function
// Vercel routes /api/* requests to this function
// The Express app handles routes with /api prefix
module.exports = (req, res) => {
  // Ensure the path includes /api prefix for Express routes
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  return app(req, res);
};

