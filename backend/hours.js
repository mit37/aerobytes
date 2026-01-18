/**
 * Operating hours for UCSC dining locations
 * Format: { locationId: { days: { start: hour, end: hour } } }
 * Days: 0=Sunday, 1=Monday, ..., 6=Saturday
 * Hours: 0-23 (24-hour format)
 */

const LOCATION_HOURS = {
  '40': { // John R. Lewis & College Nine Dining Hall
    '1': { start: 7, end: 23 },   // Mon
    '2': { start: 7, end: 23 },   // Tue
    '3': { start: 7, end: 23 },   // Wed
    '4': { start: 7, end: 23 },   // Thu
    '5': { start: 7, end: 20 },   // Fri
    '6': { start: 7, end: 20 },   // Sat
    '0': { start: 7, end: 20 }    // Sun
  },
  '05': { // Cowell & Stevenson Dining Hall
    '0': { start: 7, end: 23 },   // Sun
    '1': { start: 7, end: 23 },    // Mon
    '2': { start: 7, end: 23 },    // Tue
    '3': { start: 7, end: 23 },    // Wed
    '4': { start: 7, end: 23 },   // Thu
    '5': { start: 7, end: 20 },   // Fri
    '6': { start: 7, end: 20 }    // Sat
  },
  '20': { // Crown & Merrill Dining Hall
    '1': { start: 7, end: 20 },   // Mon
    '2': { start: 7, end: 20 },   // Tue
    '3': { start: 7, end: 20 },   // Wed
    '4': { start: 7, end: 20 },   // Thu
    '5': { start: 7, end: 20 }    // Fri (Closed Weekends)
  },
  '25': { // Porter & Kresge Dining Hall
    '1': { start: 7, end: 19 },    // Mon
    '2': { start: 7, end: 19 },    // Tue
    '3': { start: 7, end: 19 },    // Wed
    '4': { start: 7, end: 19 },    // Thu
    '5': { start: 7, end: 19 }     // Fri (Closed Weekends)
  },
  '30': { // Rachel Carson & Oakes Dining Hall
    '1': { start: 7, end: 23 },    // Mon
    '2': { start: 7, end: 23 },    // Tue
    '3': { start: 7, end: 23 },    // Wed
    '4': { start: 7, end: 23 },   // Thu
    '5': { start: 7, end: 20 },   // Fri
    '6': { start: 7, end: 20 },   // Sat
    '0': { start: 7, end: 20 }     // Sun
  },
  '21': { // Banana Joe's
    '1': { start: 20, end: 23 },   // Mon
    '2': { start: 20, end: 23 },   // Tue
    '3': { start: 20, end: 23 },   // Wed
    '4': { start: 20, end: 23 },   // Thu
    '5': { start: 20, end: 23 }     // Fri
  },
  '23': { // Oakes Cafe
    '1': { start: 8, end: 20 },    // Mon
    '2': { start: 8, end: 20 },    // Tue
    '3': { start: 8, end: 20 },    // Wed
    '4': { start: 8, end: 20 },    // Thu
    '5': { start: 8, end: 20 }     // Fri
  },
  '46': { // Global Village Cafe
    '1': { start: 8, end: 20 },    // Mon
    '2': { start: 8, end: 20 },    // Tue
    '3': { start: 8, end: 20 },    // Wed
    '4': { start: 8, end: 20 },    // Thu
    '5': { start: 8, end: 17 }     // Fri
  },
  '24': { // Owl's Nest Cafe
    '1': { start: 8, end: 17 },    // Mon
    '2': { start: 8, end: 17 },    // Tue
    '3': { start: 8, end: 17 },    // Wed
    '4': { start: 8, end: 17 },    // Thu
    '5': { start: 8, end: 16 }     // Fri
  },
  '45': { // UCen Coffee Bar
    '1': { start: 8, end: 16 },     // Mon
    '2': { start: 8, end: 16 },     // Tue
    '3': { start: 8, end: 16 },     // Wed
    '4': { start: 8, end: 16 },     // Thu
    '5': { start: 8, end: 16 }      // Fri
  },
  '26': { // Stevenson Coffee House
    '1': { start: 8, end: 20 },     // Mon
    '2': { start: 8, end: 20 },     // Tue
    '3': { start: 8, end: 20 },     // Wed
    '4': { start: 8, end: 20 },     // Thu
    '5': { start: 8, end: 20 }      // Fri
  },
  '22': { // Perk Coffee Bar
    '1': { start: 8, end: 17 },     // Mon
    '2': { start: 8, end: 17 },     // Tue
    '3': { start: 8, end: 17 },     // Wed
    '4': { start: 8, end: 17 },     // Thu
    '5': { start: 8, end: 17 }      // Fri
  },
  '50': { // Porter Market
    '1': { start: 8, end: 20 },     // Mon
    '2': { start: 8, end: 20 },     // Tue
    '3': { start: 8, end: 20 },     // Wed
    '4': { start: 8, end: 20 },     // Thu
    '5': { start: 8, end: 20 }      // Fri
  },
  '47': { // Merrill Market
    '1': { start: 9, end: 20 },     // Mon
    '2': { start: 9, end: 20 },     // Tue
    '3': { start: 9, end: 20 },     // Wed
    '4': { start: 9, end: 20 },     // Thu
    '5': { start: 9, end: 20 }      // Fri
  }
};

/**
 * Check if a location is currently open
 * @param {string} locationId - The location ID
 * @returns {boolean} - True if open, false if closed
 */
function isLocationOpen(locationId) {
  const hours = LOCATION_HOURS[locationId];
  if (!hours) {
    // If no hours defined, assume open (for backwards compatibility)
    return true;
  }

  // TEMPORARY: Set to Monday 7:30 AM for local testing
  // TODO: Remove this and use actual time for production
  const dayOfWeek = 1; // Monday
  const currentTime = 7.5; // 7:30 AM
  
  /* Original time-based logic (commented out for testing):
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + (currentMinute / 60);
  */

  const dayHours = hours[dayOfWeek.toString()];
  if (!dayHours) {
    // No hours for this day = closed
    return false;
  }

  // Check if current time is within operating hours
  return currentTime >= dayHours.start && currentTime < dayHours.end;
}

/**
 * Get operating hours for a location
 * @param {string} locationId - The location ID
 * @returns {object|null} - Hours object or null if not found
 */
function getLocationHours(locationId) {
  return LOCATION_HOURS[locationId] || null;
}

module.exports = {
  isLocationOpen,
  getLocationHours,
  LOCATION_HOURS
};

