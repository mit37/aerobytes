const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

/**
 * Load all users
 */
async function loadUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error loading users:', error);
        return [];
    }
}

/**
 * Save all users
 */
async function saveUsers(users) {
    try {
        await ensureDataDir();
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
        throw error;
    }
}

/**
 * Find user by email
 */
async function getUserByEmail(email) {
    const users = await loadUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find user by ID
 */
async function getUserById(userId) {
    const users = await loadUsers();
    return users.find(u => u.id === userId) || null;
}

/**
 * Create or update a user
 * If user with email exists, update provided fields.
 * If not, create new user.
 */
async function createOrUpdateUser(userData) {
    const { email, name, phone } = userData;

    if (!email) {
        throw new Error('Email is required');
    }

    const users = await loadUsers();
    let userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    let user;

    const now = new Date().toISOString();

    if (userIndex >= 0) {
        // Update existing
        user = users[userIndex];
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.lastSeen = now;
    } else {
        // Create new
        user = {
            id: `USR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            email: email.toLowerCase(),
            name: name || '',
            phone: phone || '',
            createdAt: now,
            lastSeen: now,
            orderCount: 0
        };
        users.push(user);
    }

    await saveUsers(users);
    return user;
}

/**
 * Increment order count for a user
 */
async function incrementOrderCount(userId) {
    const users = await loadUsers();
    const user = users.find(u => u.id === userId);

    if (user) {
        user.orderCount = (user.orderCount || 0) + 1;
        user.lastOrderAt = new Date().toISOString();
        await saveUsers(users);
    }
}

module.exports = {
    getUserByEmail,
    getUserById,
    createOrUpdateUser,
    incrementOrderCount
};
