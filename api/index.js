const app = require('../server');

// Export as Vercel serverless function
// Vercel automatically routes /api/* requests to files in the /api directory
// When a request comes to /api/dining-locations, Vercel routes it here
// The req.url will be /api/dining-locations, which matches Express routes
module.exports = app;

