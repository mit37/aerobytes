const app = require('../server');

// Export as Vercel serverless function for other API routes
// This handles routes like /api/orders, /api/users, etc.
// Note: /api/dining-locations and /api/menu-items are handled by separate files
module.exports = app;

