const cron = require('node-cron');
const { getDiningLocations, getMenuItems } = require('./scraper');
const UCSC_LOCATIONS = require('./locations');

/**
 * Convert PST to cron schedule
 * 12:00 AM PST = 8:00 AM UTC (PST is UTC-8)
 * But we need to account for PDT (UTC-7) during daylight saving
 * For simplicity, we'll use 8:00 AM UTC which is 12:00 AM PST (or 1:00 AM PDT)
 * 
 * Actually, let's use a more reliable approach: schedule for 12:00 AM Pacific time
 * Cron format: minute hour day month weekday
 * We'll use 0 8 * * * for 8:00 AM UTC = 12:00 AM PST (approximately)
 * 
 * Better: Use 0 0 * * * and set TZ=America/Los_Angeles
 */
function startScheduler() {
  console.log('Starting daily scraper scheduler...');
  console.log('Scheduled to run daily at 12:00 AM PST');
  
  // Schedule for 12:00 AM Pacific Time (handles PST/PDT automatically)
  // Using America/Los_Angeles timezone
  cron.schedule('0 0 * * *', async () => {
    console.log('\n=== Starting scheduled daily scrape at 12:00 AM PST ===');
    console.log(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    
    try {
      // Scrape all dining locations
      console.log('Scraping dining locations...');
      const locations = await getDiningLocations(true); // Force refresh
      console.log(`Scraped ${locations.length} dining locations`);
      
      // Scrape menu items for all locations
      console.log('Scraping menu items for all locations...');
      let totalItems = 0;
      
      for (const location of locations) {
        try {
          console.log(`Scraping menu for: ${location.name} (${location.id})`);
          const menuItems = await getMenuItems(location.id, location.locationName, null, true); // Force refresh
          totalItems += menuItems.length;
          console.log(`  - Found ${menuItems.length} menu items`);
          
          // Small delay to avoid hammering the server
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`  - Error scraping menu for ${location.name}:`, error.message);
        }
      }
      
      console.log(`\n=== Daily scrape complete ===`);
      console.log(`Total locations: ${locations.length}`);
      console.log(`Total menu items: ${totalItems}`);
      console.log(`Completed at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}\n`);
    } catch (error) {
      console.error('Error during scheduled scrape:', error);
    }
  }, {
    scheduled: true,
    timezone: 'America/Los_Angeles'
  });
  
  console.log('Scheduler started successfully');
}

module.exports = {
  startScheduler
};

