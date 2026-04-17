const axios = require('axios');

async function runTests() {
  try {
    console.log('--- TESTING SEARCH API ---');
    const searchRes = await axios.get('http://localhost:5000/api/products?search=Wraith');
    console.log('Search Results Count:', searchRes.data.length);
    if (searchRes.data.length === 0) throw new Error('Search failed: No results found for "Wraith"');
    
    const product = searchRes.data[0];
    console.log('Found product:', product.name);

    console.log('\n--- TESTING SINGLE PRODUCT FETCH ---');
    const productRes = await axios.get(`http://localhost:5000/api/products/${product._id}`);
    console.log('Fetched single product:', productRes.data.name);

    console.log('\n--- TESTING AUTHENTICATION ---');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@example.com',
      password: 'Password123!'
    });
    
    const cookies = loginRes.headers['set-cookie'];
    if (!cookies) throw new Error('No cookies returned on login');
    const authHeaders = { Cookie: cookies.join(';') };
    console.log('Login successful, retrieved auth cookies.');

    console.log('\n--- TESTING CHECKOUT FLOW (M-Pesa INIT) ---');
    const orderPayload = {
      items: [{
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0],
        size: 'M',
        color: product.colors[0].name
      }],
      shippingAddress: {
        firstName: 'John', lastName: 'Doe', phone: '254711111111', address1: '123 Fake St', city: 'Nbi', country: 'Kenya', postalCode: '00100'
      },
      paymentMethod: 'mpesa',
      subtotal: product.price,
      shipping: 12,
      tax: Math.round(product.price * 0.05),
      total: product.price + 12 + Math.round(product.price * 0.05)
    };
    
    const orderRes = await axios.post('http://localhost:5000/api/orders', orderPayload, { headers: authHeaders });
    const order = orderRes.data;
    console.log('Order created:', order._id);

    console.log('Initiating STK Push...');
    const mpesaRes = await axios.post('http://localhost:5000/api/payments/mpesa/initiate', {
        orderId: order._id,
        phone: '254711111111',
        amount: order.total
    }, { headers: authHeaders });

    console.log('M-Pesa STK Push response:', mpesaRes.data);

    console.log('\n--- TESTING M-PESA CONFIRMATION (STOCK DECREMENT) ---');
    const oldStock = (await axios.get(`http://localhost:5000/api/products/${product._id}`)).data.stock;
    console.log('Stock before payment:', oldStock);

    await axios.post('http://localhost:5000/api/payments/mpesa/confirm', { orderId: order._id }, { headers: authHeaders });
    console.log('Payment confirmed via demo mode.');

    const newStock = (await axios.get(`http://localhost:5000/api/products/${product._id}`)).data.stock;
    console.log('Stock after payment:', newStock);

    if (newStock !== oldStock - 1) {
        throw new Error(`Stock decrement failed: expected ${oldStock - 1}, got ${newStock}`);
    }
    console.log('STOCK DECREMENT VERIFIED!');
    
    console.log('\nALL INTEGRATION TESTS PASSED!');
  } catch(e) {
    console.error('TEST FAILED:', e.response?.data || e.message);
  }
}
runTests();
