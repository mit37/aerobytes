const { getUserByEmail } = require('./backend/users');
const { getAllOrders, getOrdersByUser } = require('./backend/orders');

async function debug() {
    const email = 'neolapinto2007@gmail.com';
    console.log('Testing getUserByEmail...');
    try {
        const user = await getUserByEmail(email);
        console.log('User found:', user);

        if (user) {
            console.log('Testing getOrdersByUser...');
            const orders = await getOrdersByUser(user.id);
            console.log('Orders count:', orders.length);
        } else {
            console.log('Testing getAllOrders fallback...');
            const all = await getAllOrders();
            const filtered = all.filter(o => o.customer?.email?.toLowerCase() === email.toLowerCase());
            console.log('Filtered orders count:', filtered.length);
        }
    } catch (err) {
        console.error('DEBUG ERROR:', err);
    }
}

debug();
