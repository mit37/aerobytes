/**
 * Simple in-memory cache with TTL (Time To Live)
 * Cache duration: 5-10 minutes (default 7 minutes)
 */

class Cache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 7 * 60 * 1000; // 7 minutes in milliseconds
  }

  /**
   * Get cached value if it exists and hasn't expired
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if expired/missing
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Set a value in cache with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = null) {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Clear a specific key from cache
   * @param {string} key - Cache key to clear
   */
  clear(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
module.exports = new Cache();

