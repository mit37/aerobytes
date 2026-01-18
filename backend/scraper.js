const axios = require('axios');
const cheerio = require('cheerio');
const cache = require('./cache');
const UCSC_LOCATIONS = require('./locations');
const storage = require('./storage');

const BASE_URL = 'https://nutrition.sa.ucsc.edu';

/**
 * Scrape dining locations from UCSC nutrition website
 * @returns {Promise<Array>} Array of dining location objects
 */
async function getDiningLocations(forceRefresh = false) {
  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cacheKey = 'dining-locations';
    const cached = cache.get(cacheKey);
    if (cached && cached.length > 0) {
      console.log('Returning cached dining locations');
      return cached;
    }
    
    // Check stored data
    try {
      const stored = await storage.loadLocations();
      if (stored && stored.length > 0) {
        console.log('Returning stored dining locations');
        cache.set(cacheKey, stored);
        return stored;
      }
    } catch (error) {
      console.log('Could not load stored locations, will scrape:', error.message);
    }
  }

  console.log('Scraping dining locations from UCSC website...');
  const startTime = Date.now();

  try {
    // Fetch the main page to get location dropdown
    const response = await axios.get(BASE_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    console.log(`Fetched page in ${Date.now() - startTime}ms`);

    const $ = cheerio.load(response.data);
    const locations = [];

    // Find the location dropdown - try multiple selectors
    let locationSelect = $('select[name="locationNum"]');
    
    if (locationSelect.length === 0) {
      locationSelect = $('select#locationNum');
    }
    
    if (locationSelect.length === 0) {
      locationSelect = $('select[id*="location"]');
    }
    
    if (locationSelect.length === 0) {
      // Try finding any select with multiple options
      $('select').each((i, el) => {
        const $select = $(el);
        const options = $select.find('option');
        if (options.length > 5) { // Likely the location dropdown
          locationSelect = $select;
          return false; // Break
        }
      });
    }

    if (locationSelect.length === 0) {
      console.warn('Could not find location dropdown, using fallback list');
      const fallbackLocations = UCSC_LOCATIONS;
      cache.set(cacheKey, fallbackLocations);
      return fallbackLocations;
    }
    
    console.log(`Found location select with ${locationSelect.find('option').length} options`);

    // Extract options from select element
    locationSelect.find('option').each((i, element) => {
      const $option = $(element);
      const value = $option.attr('value');
      const text = $option.text().trim();

      // Skip placeholder/empty options
      if (!value || value === '' || value === '0' || 
          text.toLowerCase().includes('select') ||
          text.toLowerCase().includes('choose') ||
          text.toLowerCase().includes('please') ||
          text === '' ||
          text.length < 3) {
        return;
      }

      const locationNum = value;
      const locationName = text;

      locations.push({
        id: locationNum,
        name: locationName,
        locationName: locationName,
        type: 'dining_hall',
        supports_drone: true,
        is_open: true
      });
    });
    
    console.log(`Extracted ${locations.length} locations from page`);

    // If no locations found from scraping, use fallback
    if (locations.length === 0) {
      console.log('No locations found from scraping, using fallback list');
      locations = [...UCSC_LOCATIONS];
    } else {
      // Merge with fallback to ensure we have all locations
      const foundIds = new Set(locations.map(l => l.id));
      UCSC_LOCATIONS.forEach(fallbackLoc => {
        if (!foundIds.has(fallbackLoc.id)) {
          console.log(`Adding fallback location: ${fallbackLoc.name}`);
          locations.push(fallbackLoc);
        }
      });
    }

    // Cache and save the results
    const cacheKey = 'dining-locations';
    cache.set(cacheKey, locations);
    try {
      await storage.saveLocations(locations);
      await storage.saveLastScrape('locations');
    } catch (error) {
      console.error('Error saving locations:', error.message);
    }

    console.log(`Total: ${locations.length} dining locations found in ${Date.now() - startTime}ms`);
    return locations;
  } catch (error) {
    console.error('Error scraping dining locations:', error.message);
    
    // Return fallback locations on error
    console.log('Using fallback locations due to error');
    const fallbackLocations = [...UCSC_LOCATIONS];
    const cacheKey = 'dining-locations';
    cache.set(cacheKey, fallbackLocations);
    try {
      await storage.saveLocations(fallbackLocations);
    } catch (storageError) {
      console.error('Error saving fallback locations:', storageError.message);
    }
    return fallbackLocations;
  }
}

/**
 * Scrape menu items for a specific dining location
 * @param {string} locationId - The location number/ID
 * @param {string} locationName - The location name (optional, will be looked up if not provided)
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<Array>} Array of menu item objects
 */
async function getMenuItems(locationId, locationName = null, progressCallback = null, forceRefresh = false) {
  if (!locationId) {
    return [];
  }

  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cacheKey = `menu-items-${locationId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Returning cached menu items for location ${locationId}`);
      if (progressCallback) progressCallback(100, 'Using cached data');
      return cached;
    }
    
    // Check stored data
    const stored = await storage.loadMenuItems(locationId);
    if (stored && stored.length > 0) {
      console.log(`Returning stored menu items for location ${locationId}`);
      cache.set(cacheKey, stored);
      if (progressCallback) progressCallback(100, 'Using stored data');
      return stored;
    }
  }

  console.log(`Scraping menu items for location ${locationId}...`);
  const startTime = Date.now();

  if (progressCallback) progressCallback(10, 'Starting scrape...');

  try {
    // Get locationName if not provided
    if (!locationName) {
      if (progressCallback) progressCallback(20, 'Looking up location name...');
      
      const cachedLocations = cache.get('dining-locations');
      if (cachedLocations) {
        const location = cachedLocations.find(loc => loc.id === locationId);
        if (location && location.locationName) {
          locationName = location.locationName;
        }
      }
      
      if (!locationName) {
        const fallbackLocation = UCSC_LOCATIONS.find(loc => loc.id === locationId);
        if (fallbackLocation && fallbackLocation.locationName) {
          locationName = fallbackLocation.locationName;
        }
      }
    }

    if (!locationName) {
      throw new Error(`Could not find locationName for locationId ${locationId}`);
    }

    // Construct menu URL
    const encodedLocationName = encodeURIComponent(locationName);
    const menuUrl = `${BASE_URL}/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=${locationId}&locationName=${encodedLocationName}&naFlag=1`;
    
    console.log(`Fetching menu from: ${menuUrl}`);
    if (progressCallback) progressCallback(30, 'Fetching menu page...');

    const response = await axios.get(menuUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    console.log(`Fetched menu page in ${Date.now() - startTime}ms`);
    if (progressCallback) progressCallback(50, 'Parsing menu data...');

    const $ = cheerio.load(response.data);
    const menuItems = [];
    const seenItems = new Set();

    // UCSC menu items are in tables - look for all table rows
    const allRows = $('table tr');
    const totalRows = allRows.length;
    console.log(`Found ${totalRows} table rows to process`);

    if (progressCallback) progressCallback(60, `Processing ${totalRows} items...`);

    // Track current meal period as we iterate
    // Default to "All Day" if no heder found yet, but we expect headers
    let currentMeal = 'All Day'; 
    
    // Map of unique ItemName -> { itemObject, mealPeriods: Set }
    const uniqueItemsMap = new Map();

    allRows.each((i, element) => {
      const $el = $(element);
      const text = $el.text().trim();
      
      // Check for Meal Headers (e.g., "Breakfast", "Lunch", "Dinner")
      // These are usually in a distinct style or row. 
      // Based on browser inspection, they might be in a td with a specific class or just distinct text
      // We'll look for exact matches or strong indicators
      
      const lowerText = text.toLowerCase();
      
      // Heuristic detection of meal headers
      // They are often short and match our target meals
      if (text.length < 20) {
        if (lowerText.includes('breakfast')) {
          currentMeal = 'Breakfast';
          return;
        } else if (lowerText.includes('lunch') || lowerText.includes('brunch')) {
           // Treating Brunch as Lunch for simplicity/schedule mapping
          currentMeal = 'Lunch';
          return;
        } else if (lowerText.includes('dinner')) {
          currentMeal = 'Dinner';
          return;
        } else if (lowerText.includes('late night')) {
          currentMeal = 'Late Night';
          return;
        }
      }

      // Skip header rows or category headers (e.g. "-- Soups --")
      if ($el.find('th').length > 0 || text.startsWith('--')) {
        return;
      }

      // Skip empty rows
      if (!text || text.length < 3) {
        return;
      }

      // Extract item name - try multiple methods
      let itemName = $el.find('strong').first().text().trim();
      if (!itemName) {
        const $firstTd = $el.find('td').first();
        itemName = $firstTd.text().trim();
      }
      if (!itemName) {
        itemName = $el.find('a').first().text().trim();
      }
      if (!itemName) {
        // Take first line of text
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        itemName = lines[0] || text.substring(0, 100).trim();
      }

      // Clean up item name
      itemName = itemName.replace(/\s+/g, ' ').trim();
      
      // Skip invalid names
      if (itemName.length < 2 || 
          itemName.length > 200 ||
          itemName.toUpperCase() === itemName && itemName.length > 30 ||
          itemName.toLowerCase().includes('select') ||
          itemName.toLowerCase().includes('category') ||
          itemName.toLowerCase().includes('menu') && itemName.length < 10) {
        return;
      }

      // Extract calories
      let calories = null;
      const calPatterns = [
        /(?:cal|calories?)[:\s]*(\d+)/i,
        /(\d+)\s*(?:cal|calories?)/i,
        /kcal[:\s]*(\d+)/i
      ];
      
      for (const pattern of calPatterns) {
        const calMatch = text.match(pattern);
        if (calMatch) {
          const calValue = parseInt(calMatch[1], 10);
          if (!isNaN(calValue) && calValue > 0 && calValue < 10000) {
            calories = calValue;
            break;
          }
        }
      }

      const itemId = `${locationId}-${itemName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50)}`;
      
      // Deduplication and Merging Logic
      if (uniqueItemsMap.has(itemName.toLowerCase())) {
        // Existing item - add current meal to its periods
        const existing = uniqueItemsMap.get(itemName.toLowerCase());
        existing.mealPeriods.add(currentMeal);
      } else {
        // New item
        uniqueItemsMap.set(itemName.toLowerCase(), {
          id: itemId,
          dining_location_id: locationId,
          name: itemName,
          calories: calories,
          is_available: true,
          mealPeriods: new Set([currentMeal])
        });
      }

      // Update progress
      if (progressCallback && i % 10 === 0) {
        const progress = 60 + Math.floor((i / totalRows) * 30);
        progressCallback(progress, `Processing item ${i + 1} of ${totalRows}...`);
      }
    });
    
    // Convert map back to array
    menuItems.push(...Array.from(uniqueItemsMap.values()).map(item => ({
      ...item,
      meal_periods: Array.from(item.mealPeriods) // Convert Set to Array
    })));

    // Cache and save the results
    const cacheKey = `menu-items-${locationId}`;
    cache.set(cacheKey, menuItems);
    await storage.saveMenuItems(locationId, menuItems);
    await storage.saveLastScrape('menuItems', locationId);

    console.log(`Found ${menuItems.length} menu items in ${Date.now() - startTime}ms`);
    if (menuItems.length > 0) {
      console.log(`Sample items: ${menuItems.slice(0, 3).map(item => `${item.name} (${item.meal_periods.join(', ')})`).join('; ')}`);
    }
    
    if (progressCallback) progressCallback(100, 'Complete!');
    
    return menuItems;
  } catch (error) {
    console.error(`Error scraping menu items for location ${locationId}:`, error.message);
    
    if (progressCallback) progressCallback(100, 'Error occurred');
    
    // Return cached data if available (even if expired) as fallback
    const staleCache = cache.get(cacheKey);
    if (staleCache) {
      console.log('Returning stale cached data due to error');
      return staleCache;
    }
    
    // Return empty array on error (graceful degradation)
    return [];
  }
}

module.exports = {
  getDiningLocations,
  getMenuItems
};
