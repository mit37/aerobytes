/**
 * Mock/hardcoded data for immediate display
 * All menu items from actual UCSC menus
 */

const MOCK_LOCATIONS = [
  {
    id: '40',
    name: 'John R. Lewis & College Nine Dining Hall',
    locationName: 'John R. Lewis & College Nine Dining Hall',
    type: 'dining_hall',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=John+R.+Lewis+%26+College+Nine+Dining+Hall&naFlag=1'
  },
  {
    id: '05',
    name: 'Cowell & Stevenson Dining Hall',
    locationName: 'Cowell & Stevenson Dining Hall',
    type: 'dining_hall',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=05&locationName=Cowell+%26+Stevenson+Dining+Hall&naFlag=1'
  },
  {
    id: '20',
    name: 'Crown & Merrill Dining Hall',
    locationName: 'Crown & Merrill Dining Hall',
    type: 'dining_hall',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=20&locationName=Crown+%26+Merrill+Dining+Hall&naFlag=1'
  },
  {
    id: '25',
    name: 'Porter & Kresge Dining Hall',
    locationName: 'Porter & Kresge Dining Hall',
    type: 'dining_hall',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=25&locationName=Porter+%26+Kresge+Dining+Hall&naFlag=1'
  },
  {
    id: '30',
    name: 'Rachel Carson & Oakes Dining Hall',
    locationName: 'Rachel Carson & Oakes Dining Hall',
    type: 'dining_hall',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=30&locationName=Rachel+Carson+%26+Oakes+Dining+Hall&naFlag=1'
  },
  {
    id: '21',
    name: "Banana Joe's",
    locationName: "Banana Joe's",
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=21&locationName=Banana+Joe%27s&naFlag=1'
  },
  {
    id: '23',
    name: 'Oakes Cafe',
    locationName: 'Oakes Cafe',
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=23&locationName=Oakes+Cafe&naFlag=1'
  },
  {
    id: '46',
    name: 'Global Village Cafe',
    locationName: 'Global Village Cafe',
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=46&locationName=Global+Village+Cafe&naFlag=1'
  },
  {
    id: '24',
    name: "Owl's Nest Cafe",
    locationName: "Owl's Nest Cafe",
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=24&locationName=Owl%27s+Nest+Cafe&naFlag=1'
  },
  {
    id: '45',
    name: 'UCen Coffee Bar',
    locationName: 'UCen Coffee Bar',
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=45&locationName=UCen+Coffee+Bar&naFlag=1'
  },
  {
    id: '26',
    name: 'Stevenson Coffee House',
    locationName: 'Stevenson Coffee House',
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=26&locationName=Stevenson+Coffee+House&naFlag=1'
  },
  {
    id: '22',
    name: 'Perk Coffee Bar',
    locationName: 'Perk Coffee Bar',
    type: 'cafe',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=22&locationName=Perk+Coffee+Bar&naFlag=1'
  },
  {
    id: '50',
    name: 'Porter Market',
    locationName: 'Porter Market',
    type: 'market',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=50&locationName=Porter+Market&naFlag=1'
  },
  {
    id: '47',
    name: 'Merrill Market',
    locationName: 'Merrill Market',
    type: 'market',
    supports_drone: true,
    is_open: true,
    url: 'https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=47&locationName=Merrill+Market&naFlag=1'
  }
];

// Helper function to create menu item
function createItem(locationId, name, mealPeriods = ['Lunch', 'Dinner']) {
  const id = `${locationId}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50)}`;
  return {
    id,
    dining_location_id: locationId,
    name,
    calories: Math.floor(Math.random() * 500) + 100,
    is_available: true,
    meal_periods: mealPeriods
  };
}

const MOCK_MENU_ITEMS = {
  '40': [ // John R. Lewis & College Nine Dining Hall
    // Breakfast (7-11:30)
    createItem('40', 'Banana and Coconut Pancakes', ['Breakfast']),
    createItem('40', 'Cage-Free Scrambled Eggs', ['Breakfast']),
    createItem('40', 'Hard-boiled Cage Free Egg (1)', ['Breakfast']),
    createItem('40', 'Mexican Chorizo Sausage', ['Breakfast']),
    createItem('40', 'Organic Gluten-Free Oatmeal', ['Breakfast']),
    createItem('40', 'Roasted Yukon Gold Potatoes', ['Breakfast']),
    createItem('40', 'Vegan Happy Scramble', ['Breakfast']),
    createItem('40', 'Steamed Rice', ['Breakfast', 'Lunch', 'Dinner']),
    createItem('40', 'Old Fashioned Cake Donuts', ['Breakfast']),
    // Lunch (11:30-5)
    createItem('40', 'Organic Black Bean Soup', ['Lunch']),
    createItem('40', 'Spicy North African Chicken Soup', ['Lunch']),
    createItem('40', 'Cheese Pizza', ['Lunch', 'Dinner', 'Late Night']),
    createItem('40', 'Sausage and Mushroom Pizza', ['Lunch', 'Dinner', 'Late Night']),
    createItem('40', 'Allergen Free Halal Chicken Thigh', ['Lunch', 'Dinner']),
    createItem('40', 'Tofu with Kosher Salt', ['Lunch', 'Dinner']),
    createItem('40', 'Gluten-Free Snickerdoodle Cookie', ['Lunch', 'Dinner', 'Late Night']),
    createItem('40', 'Pound Cake', ['Lunch', 'Dinner', 'Late Night']),
    createItem('40', 'Available Upon Request: Gluten Free Rotini Pasta', ['Lunch', 'Dinner']),
    createItem('40', 'Condiments', ['Breakfast', 'Lunch', 'Dinner', 'Late Night']),
    createItem('40', 'Focaccia Breadsticks', ['Lunch', 'Dinner']),
    createItem('40', 'Housemade Creamy Alfredo Sauce', ['Lunch', 'Dinner']),
    createItem('40', 'Italian Roasted Squash and Carrots', ['Lunch', 'Dinner']),
    createItem('40', 'Italian Roasted Tofu', ['Lunch', 'Dinner']),
    createItem('40', 'Marinara Sauce', ['Lunch', 'Dinner']),
    createItem('40', 'Meatballs', ['Lunch', 'Dinner']),
    createItem('40', 'Pasta Bar', ['Lunch', 'Dinner']),
    createItem('40', 'Penne', ['Lunch', 'Dinner']),
    createItem('40', 'Deli Bar', ['Lunch']),
    createItem('40', 'Salad Bar', ['Lunch']),
    // Dinner (5-8)
    createItem('40', 'Porcini Crusted Roasted Chicken', ['Dinner']),
    createItem('40', 'Sauteed Rainbow Chard with Garlic Oil', ['Dinner']),
    createItem('40', 'Steamed Brown Rice', ['Dinner']),
    createItem('40', 'Apple Pie', ['Dinner']),
    createItem('40', 'Basmati Rice Pullao', ['Dinner']),
    createItem('40', 'Chana Masala', ['Dinner']),
    createItem('40', 'Chicken Tikka Masala', ['Dinner']),
    createItem('40', 'Dal Saag', ['Dinner']),
    createItem('40', 'Masala Baked Tofu', ['Dinner']),
    createItem('40', 'North Indian Bar', ['Dinner']),
    createItem('40', 'Original Naan', ['Dinner'])
  ],

  '05': [ // Cowell & Stevenson Dining Hall
    // Breakfast
    createItem('05', 'Cage-Free Scrambled Eggs', ['Breakfast']),
    createItem('05', 'Cajun Roasted Red Potatoes', ['Breakfast']),
    createItem('05', 'Hard-boiled Cage Free Egg (1)', ['Breakfast']),
    createItem('05', 'Organic Gluten-Free Oatmeal', ['Breakfast']),
    createItem('05', 'Sausage Links', ['Breakfast']),
    createItem('05', 'Sourdough French Toast', ['Breakfast']),
    createItem('05', 'Thai Tofu Scramble', ['Breakfast']),
    createItem('05', 'Steamed Rice', ['Breakfast', 'Lunch', 'Dinner']),
    createItem('05', 'Old Fashioned Cake Donuts', ['Breakfast']),
    createItem('05', 'Carrot Raisin Muffin', ['Breakfast']),
    createItem('05', 'Orange Cranberry Scone', ['Breakfast']),
    createItem('05', 'Pumpkin Muffin', ['Breakfast']),
    // Lunch
    createItem('05', 'Green Pozole with Chicken', ['Lunch']),
    createItem('05', 'Cheese Pizza', ['Lunch', 'Dinner', 'Late Night']),
    createItem('05', 'Focaccia Pizza with Basil Pesto', ['Lunch']),
    createItem('05', 'Allergen Free Halal Chicken Thigh', ['Lunch', 'Dinner']),
    createItem('05', 'Tofu with Kosher Salt', ['Lunch', 'Dinner']),
    createItem('05', 'Gluten-Free Snickerdoodle Cookie', ['Lunch', 'Dinner', 'Late Night']),
    createItem('05', 'Pound Cake', ['Lunch', 'Dinner', 'Late Night']),
    createItem('05', 'Available Upon Request: Gluten Free Rotini Pasta', ['Lunch', 'Dinner']),
    createItem('05', 'Bolognese Sauce', ['Lunch', 'Dinner']),
    createItem('05', 'Condiments', ['Breakfast', 'Lunch', 'Dinner', 'Late Night']),
    createItem('05', 'Focaccia Breadsticks', ['Lunch', 'Dinner']),
    createItem('05', 'Marinara Sauce', ['Lunch', 'Dinner']),
    createItem('05', 'Pasta Bar', ['Lunch', 'Dinner']),
    createItem('05', 'Penne', ['Lunch', 'Dinner']),
    createItem('05', 'Steamed Broccoli', ['Lunch']),
    createItem('05', 'Deli Bar', ['Lunch']),
    createItem('05', 'Salad Bar', ['Lunch']),
    // Dinner
    createItem('05', 'Cajun Lightning Chicken', ['Dinner']),
    createItem('05', 'Quinoa with Lemon and Thyme', ['Dinner']),
    createItem('05', 'Roasted Broccoli and Carrots', ['Dinner']),
    createItem('05', 'Apple Pie', ['Dinner']),
    createItem('05', 'Battered Popcorn Chicken', ['Dinner']),
    createItem('05', 'Creamy Mashed Yukon Golds', ['Dinner']),
    createItem('05', 'Mashed Potato Bowl Bar', ['Dinner']),
    createItem('05', 'Roasted Kale and Butternut Squash', ['Dinner']),
    createItem('05', 'Vegan Garlic Mashed Potatoes', ['Dinner']),
    createItem('05', 'Vegan Mushroom Gravy', ['Dinner']),
    // Late Night
    createItem('05', 'Pepperoni Pizza', ['Late Night']),
    createItem('05', 'Chocolate Chip Cookie', ['Late Night']),
    createItem('05', 'Ice Cream Bar', ['Late Night'])
  ],

  '20': [ // Crown & Merrill Dining Hall - No menu data available
    createItem('20', 'Top Ramen', ['Late Night']),
    createItem('20', 'Microwave Burrito', ['Late Night']),
    createItem('20', 'Cookies', ['Late Night'])
  ],

  '25': [ // Porter & Kresge Dining Hall - No menu data available
    createItem('25', 'Menu items coming soon', ['Breakfast', 'Lunch', 'Dinner', 'Late Night'])
  ],

  '30': [ // Rachel Carson & Oakes Dining Hall
    // Breakfast
    createItem('30', 'Old Fashioned Cake Donuts', ['Breakfast']),
    createItem('30', 'Cage-Free Scrambled Eggs', ['Breakfast']),
    createItem('30', 'Cajun Roasted Red Potatoes', ['Breakfast']),
    createItem('30', 'French Toast Sticks', ['Breakfast']),
    createItem('30', 'Sausage Links', ['Breakfast']),
    createItem('30', 'Thai Tofu Scramble', ['Breakfast']),
    createItem('30', 'Hard-boiled Cage Free Egg (1)', ['Breakfast']),
    createItem('30', 'Steamed Rice', ['Breakfast', 'Lunch', 'Dinner']),
    createItem('30', 'Organic Gluten-Free Oatmeal', ['Breakfast']),
    // Lunch
    createItem('30', 'Allergen Free Halal Chicken Thigh', ['Lunch', 'Dinner']),
    createItem('30', 'Tofu with Kosher Salt', ['Lunch', 'Dinner']),
    createItem('30', 'Gluten-Free Snickerdoodle Cookie', ['Lunch', 'Dinner']),
    createItem('30', 'Pound Cake', ['Lunch', 'Dinner']),
    createItem('30', 'Available Upon Request: Gluten Free Rotini Pasta', ['Lunch', 'Dinner']),
    createItem('30', 'Bolognese Sauce', ['Lunch', 'Dinner']),
    createItem('30', 'Condiments', ['Breakfast', 'Lunch', 'Dinner']),
    createItem('30', 'Marinara Sauce', ['Lunch', 'Dinner']),
    createItem('30', 'Pasta Bar', ['Lunch', 'Dinner']),
    createItem('30', 'Penne', ['Lunch', 'Dinner']),
    createItem('30', 'Deli Bar', ['Lunch']),
    createItem('30', 'Salad Bar', ['Lunch'])
  ],

  '22': [ // Perk Coffee Bar - No data available
    createItem('22', 'Menu items coming soon', ['Breakfast', 'Lunch', 'Dinner'])
  ],

  '50': [ // Porter Market - No data available
    createItem('50', 'Menu items coming soon', ['Breakfast', 'Lunch', 'Dinner', 'Late Night'])
  ],

  '47': [ // Merrill Market - No data available
    createItem('47', 'Menu items coming soon', ['Breakfast', 'Lunch', 'Dinner', 'Late Night'])
  ]
};

// Generate menu items for locations that don't have specific data
function getMockMenuItems(locationId) {
  if (MOCK_MENU_ITEMS[locationId]) {
    return MOCK_MENU_ITEMS[locationId];
  }

  // Generic menu for any location not in the list
  return [
    createItem(locationId, 'Daily Special', ['Lunch', 'Dinner']),
    createItem(locationId, 'Chef\'s Choice', ['Lunch', 'Dinner']),
    createItem(locationId, 'Soup of the Day', ['Lunch', 'Dinner']),
    createItem(locationId, 'Fresh Salad', ['Lunch']),
    createItem(locationId, 'Sandwich', ['Lunch'])
  ];
}

module.exports = {
  MOCK_LOCATIONS,
  MOCK_MENU_ITEMS,
  getMockMenuItems
};
