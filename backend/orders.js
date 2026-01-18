const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

/**
 * Save a new order
 */
const { incrementOrderCount } = require('./users');

/**
 * Save a new order
 */
async function saveOrder(orderData) {
  try {
    await ensureDataDir();

    // Load existing orders
    let orders = [];
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf8');
      orders = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start fresh
      orders = [];
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = {
      orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    };

    orders.push(order);

    // Save orders
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    console.log(`Order saved: ${orderId}`);

    // Update user stats if userId is present
    if (orderData.userId) {
      try {
        await incrementOrderCount(orderData.userId);
      } catch (userError) {
        console.error('Error updating user stats:', userError);
      }
    }

    return order;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

/**
 * Get order by ID
 */
async function getOrder(orderId) {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);
    return orders.find(order => order.orderId === orderId) || null;
  } catch (error) {
    console.error('Error loading order:', error);
    return null;
  }
}

/**
 * Get all orders (for admin/testing)
 */
async function getAllOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

/**
 * Get orders by user ID
 */
async function getOrdersByUser(userId) {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);
    return orders.filter(order => order.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    return [];
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, status) {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);

    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return orders[orderIndex];
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

module.exports = {
  saveOrder,
  getOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus
};

