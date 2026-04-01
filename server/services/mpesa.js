const axios = require('axios');

const generateToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  if (consumerKey === 'demo') return 'demo_token_123';

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa Token Error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with M-Pesa');
  }
};

const initiateSTKPush = async (phone, amount, orderNumber) => {
  if (process.env.MPESA_CONSUMER_KEY === 'demo') {
    return {
      CheckoutRequestID: `ws_CO_${Math.floor(Math.random()*100000)}`,
      ResponseCode: '0',
      CustomerMessage: 'Success. Request accepted for processing'
    };
  }

  const token = await generateToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const passkey = process.env.MPESA_PASSKEY;
  const shortcode = process.env.MPESA_BUSINESS_SHORTCODE;
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone, // Must be 254...
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: orderNumber,
        TransactionDesc: 'Saintspeaceflygod Order'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('M-Pesa STK Push Error:', error.response?.data || error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
};

module.exports = { generateToken, initiateSTKPush };
