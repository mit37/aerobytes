const { getDiningLocations } = require('../backend/scraper');
const { MOCK_LOCATIONS } = require('../backend/mockData');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('API: Fetching dining locations (scraping if needed)...');
    // Try to scrape first, fallback to mock data if scraping fails
    let locations = [];
    try {
      locations = await getDiningLocations(false); // Use cache if available
      console.log(`API: Scraped/retrieved ${locations.length} dining locations`);
    } catch (scrapeError) {
      console.error('Scraping failed, using mock data:', scrapeError.message);
      locations = MOCK_LOCATIONS;
    }
    
    // Ensure we always return something
    if (!locations || locations.length === 0) {
      console.log('No locations from scraper, using mock data');
      locations = MOCK_LOCATIONS;
    }
    
    res.json(locations);
  } catch (error) {
    console.error('Error:', error);
    // Fallback to mock data on any error
    res.json(MOCK_LOCATIONS);
  }
};

