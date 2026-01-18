const app = require('../server');

// Export as Vercel serverless function
// Vercel automatically routes /api/* requests to files in the /api directory
// The Express app has routes defined with /api prefix
// When Vercel routes /api/dining-locations to this function, req.url will be /api/dining-locations
module.exports = app;

