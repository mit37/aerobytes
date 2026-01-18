const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const MENU_ITEMS_FILE = path.join(DATA_DIR, 'menu-items.json');
const LAST_SCRAPE_FILE = path.join(DATA_DIR, 'last-scrape.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

/**
 * Save dining locations to file
 */
async function saveLocations(locations) {
  try {
    await ensureDataDir();
    const data = {
      locations,
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now()
    };
    await fs.writeFile(LOCATIONS_FILE, JSON.stringify(data, null, 2));
    console.log(`Saved ${locations.length} locations to file`);
  } catch (error) {
    console.error('Error saving locations:', error);
  }
}

/**
 * Load dining locations from file
 */
async function loadLocations() {
  try {
    const data = await fs.readFile(LOCATIONS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    console.log(`Loaded ${parsed.locations?.length || 0} locations from file`);
    return parsed.locations || [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No locations file found, will scrape fresh data');
      return null;
    }
    console.error('Error loading locations:', error);
    return null;
  }
}

/**
 * Save menu items for a location
 */
async function saveMenuItems(locationId, menuItems) {
  try {
    await ensureDataDir();
    
    // Load existing menu items
    let allMenuItems = {};
    try {
      const data = await fs.readFile(MENU_ITEMS_FILE, 'utf8');
      allMenuItems = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start fresh
      allMenuItems = {};
    }
    
    // Update menu items for this location
    allMenuItems[locationId] = {
      menuItems,
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    await fs.writeFile(MENU_ITEMS_FILE, JSON.stringify(allMenuItems, null, 2));
    console.log(`Saved ${menuItems.length} menu items for location ${locationId}`);
  } catch (error) {
    console.error('Error saving menu items:', error);
  }
}

/**
 * Load menu items for a location
 */
async function loadMenuItems(locationId) {
  try {
    const data = await fs.readFile(MENU_ITEMS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    const locationData = parsed[locationId];
    
    if (locationData && locationData.menuItems) {
      console.log(`Loaded ${locationData.menuItems.length} menu items for location ${locationId} from file`);
      return locationData.menuItems;
    }
    return null;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No menu items file found');
      return null;
    }
    console.error('Error loading menu items:', error);
    return null;
  }
}

/**
 * Save last scrape timestamp
 */
async function saveLastScrape(type, locationId = null) {
  try {
    await ensureDataDir();
    
    let lastScrape = {};
    try {
      const data = await fs.readFile(LAST_SCRAPE_FILE, 'utf8');
      lastScrape = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }
    
    if (locationId) {
      if (!lastScrape.menuItems) lastScrape.menuItems = {};
      lastScrape.menuItems[locationId] = {
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
    } else {
      lastScrape[type] = {
        timestamp: Date.now(),
        date: new Date().toISOString()
      };
    }
    
    await fs.writeFile(LAST_SCRAPE_FILE, JSON.stringify(lastScrape, null, 2));
  } catch (error) {
    console.error('Error saving last scrape:', error);
  }
}

/**
 * Get last scrape timestamp
 */
async function getLastScrape(type, locationId = null) {
  try {
    const data = await fs.readFile(LAST_SCRAPE_FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    if (locationId && type === 'menuItems') {
      return parsed.menuItems?.[locationId]?.timestamp || null;
    }
    
    return parsed[type]?.timestamp || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get all stored menu items
 */
async function getAllMenuItems() {
  try {
    const data = await fs.readFile(MENU_ITEMS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

module.exports = {
  saveLocations,
  loadLocations,
  saveMenuItems,
  loadMenuItems,
  saveLastScrape,
  getLastScrape,
  getAllMenuItems
};

