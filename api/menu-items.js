const { getMenuItems } = require('../backend/scraper');
const { getMockMenuItems } = require('../backend/mockData');

const MEAL_PRICES = {
  'Breakfast': 12.60,
  'Lunch': 13.65,
  'Dinner': 14.70,
  'Late Night': 13.65,
  'Closed': 0
};

// Helper to get current meal period based on time
function getCurrentMealPeriod() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + (minute / 60);

  if (time >= 7 && time < 11.5) {
    return 'Breakfast';
  } else if (time >= 11.5 && time < 17) {
    return 'Lunch';
  } else if (time >= 17 && time < 20) {
    return 'Dinner';
  } else if (time >= 20 && time < 23) {
    return 'Late Night';
  } else {
    return 'Closed';
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { locationId, locationName } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'locationId is required', menuItems: [] });
    }

    console.log(`API: Fetching menu items for location ${locationId} (scraping if needed)...`);
    
    // Try to scrape first, fallback to mock data if scraping fails
    let allMenuItems = [];
    try {
      allMenuItems = await getMenuItems(locationId, locationName, null, false); // Use cache if available
      console.log(`API: Scraped/retrieved ${allMenuItems.length} menu items for location ${locationId}`);
    } catch (scrapeError) {
      console.error('Scraping failed, using mock data:', scrapeError.message);
      allMenuItems = getMockMenuItems(locationId);
    }
    
    // Ensure we always return something
    if (!allMenuItems || allMenuItems.length === 0) {
      console.log('No menu items from scraper, using mock data');
      allMenuItems = getMockMenuItems(locationId);
    }

    const currentPeriod = getCurrentMealPeriod();
    console.log(`Current Time Period: ${currentPeriod}`);

    let filteredItems = allMenuItems;

    // Filter logic
    if (currentPeriod !== 'Closed') {
      filteredItems = allMenuItems.filter(item => {
        // If item has no meal periods defined, show it always (backwards compatibility)
        if (!item.meal_periods || item.meal_periods.length === 0) return true;

        // Check if item's periods include the current period
        return item.meal_periods.includes(currentPeriod);
      });
    } else {
      // If closed, show nothing to indicate closed
      filteredItems = [];
    }

    res.json({
      menuItems: filteredItems,
      currentPeriod: currentPeriod,
      currentPrice: MEAL_PRICES[currentPeriod],
      progress: 100,
      message: currentPeriod === 'Closed' ? 'Dining location is currently closed' : `Showing ${currentPeriod} Menu ($${MEAL_PRICES[currentPeriod].toFixed(2)} - Max 4 items)`
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.json({
      menuItems: [],
      progress: 100,
      message: 'Error fetching menu'
    });
  }
};

