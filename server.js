const express = require('express');
const cors = require('cors');
const { MOCK_LOCATIONS, getMockMenuItems } = require('./backend/mockData');
const { saveOrder, getOrder, getAllOrders, getOrdersByUser, updateOrderStatus } = require('./backend/orders');
const { createOrUpdateUser, getUserByEmail } = require('./backend/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/dining-locations', (req, res) => {
  try {
    console.log('API: Returning dining locations');
    res.json(MOCK_LOCATIONS);
  } catch (error) {
    console.error('Error:', error);
    res.json(MOCK_LOCATIONS);
  }
});

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
  // Convert to PST/PDT (California time)
  // We'll use a simple offset or just local server time for now, assuming server runs in relevant timezone or we want simulation
  // User asked for:
  // Breakfast: 7–11:30 AM
  // Lunch: 11:30AM–5PM
  // Dinner: 5–8PM
  // Late Night: 8–11PM

  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + (minute / 60);

  if (time >= 7 && time < 11.5) {
    return 'Breakfast';
  } else if (time >= 11.5 && time < 17) { // 5 PM is 17
    return 'Lunch';
  } else if (time >= 17 && time < 20) { // 8 PM is 20
    return 'Dinner';
  } else if (time >= 20 && time < 23) { // 11 PM is 23
    return 'Late Night';
  } else {
    // Late night or closed. Let's show Breakfast for next day or Closed?
    // For now, let's default to closed or all items
    return 'Closed';
  }
}

app.get('/api/menu-items', (req, res) => {
  try {
    const { locationId } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'locationId is required', menuItems: [] });
    }

    console.log(`API: Returning menu items for location ${locationId}`);
    // Get all items (mock or scraped)
    // In a real scenario with scraped data, we'd fetch from scraper module or DB
    // For now using mockData with filtering
    const allMenuItems = getMockMenuItems(locationId);

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
      // If closed, maybe show nothing or show all with a "Closed" message?
      // Let's show nothing for now to indicate closed
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
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


// Order endpoints
app.post('/api/debug/echo', (req, res) => {
  console.log('Debug echo body:', JSON.stringify(req.body));
  res.json(req.body);
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;

    // Validate order data
    if (!orderData.customer || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        error: 'Invalid order data. Customer info and items are required.'
      });
    }

    // Create or update user
    let user;
    console.log('Checking for customer email:', orderData.customer?.email);
    if (orderData.customer?.email) {
      console.log('Attempting to create/update user for:', orderData.customer.email);
      try {
        user = await createOrUpdateUser({
          email: orderData.customer.email,
          name: orderData.customer.name,
          phone: orderData.customer.phone
        });
        console.log(`User linked to order: ${user.id} (${user.email})`);

        // Add userId to order data
        orderData.userId = user.id;
      } catch (userError) {
        console.error('Error creating/updating user DETAILS:', userError);
        // Continue without blocking order, but log it
      }
    } else {
      console.log('No customer email provided, skipping user creation');
    }

    const order = await saveOrder(orderData);

    console.log(`New order placed: ${order.orderId} for ${order.customer.name}`);

    res.json({
      success: true,
      orderId: order.orderId,
      message: 'Order placed successfully',
      user: user // Return user info so frontend can store it
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Failed to place order',
      message: error.message
    });
  }
});

app.get('/api/users/:email/orders', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getUserByEmail(email);
    let orders = [];

    if (!user) {
      // Fallback: search by email directly if user record doesn't exist yet
      console.log(`User ${email} not found in DB, falling back to direct email search in orders`);
      const allOrders = await getAllOrders();
      orders = allOrders
        .filter(o => o.customer?.email?.toLowerCase() === email.toLowerCase())
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return res.json({
        user: { email, name: email.split('@')[0] },
        orders
      });
    }

    orders = await getOrdersByUser(user.id);

    res.json({
      user,
      orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Admin endpoint to get all orders (for testing)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

