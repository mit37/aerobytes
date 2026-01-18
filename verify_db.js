const axios = require('axios');

async function testApi() {
    const baseURL = 'http://localhost:3001';

    try {
        console.log('1. Creating Order with new User...');
        const orderData = {
            customer: {
                name: 'Test User',
                email: 'test@example.com',
                phone: '123-456-7890',
                address: '123 Test St'
            },
            items: [
                { id: '40-pizza', name: 'Test Pizza', price: 10, quantity: 1 }
            ],
            total: 10
        };

        const orderResponse = await axios.post(`${baseURL}/api/orders`, orderData);
        console.log('Order Response:', JSON.stringify(orderResponse.data, null, 2));

        if (orderResponse.data.success && orderResponse.data.user && orderResponse.data.user.email === 'test@example.com') {
            console.log('PASS: Order created and user returned');
        } else {
            console.error('FAIL: Order creation response invalid');
            process.exit(1);
        }

        console.log('\n2. Verifying User Order History...');
        const historyResponse = await axios.get(`${baseURL}/api/users/test@example.com/orders`);
        console.log('History Response:', JSON.stringify(historyResponse.data, null, 2));

        if (historyResponse.data.user.email === 'test@example.com' && historyResponse.data.orders.length >= 1) {
            console.log('PASS: Order history retrieval successful');
        } else {
            console.error('FAIL: Order history invalid');
            process.exit(1);
        }

        console.log('\nALL TESTS PASSED');

    } catch (error) {
        console.error('Error executing tests:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Body:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

testApi();
