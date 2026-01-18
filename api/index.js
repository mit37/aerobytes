const app = require('../server');

// Export as Vercel serverless function
// Vercel will route /api/* requests to this function
// The Express app already has routes defined with /api prefix, so this should work
module.exports = app;

