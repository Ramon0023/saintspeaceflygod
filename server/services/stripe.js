const Stripe = require('stripe');

// Initialize with a dummy key if env is not loaded yet so it doesn't crash on start
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_demo';
const stripe = Stripe(stripeKey);

const createPaymentIntent = async (amount, metadata) => {
  if (stripeKey === 'sk_test_demo') {
    return { client_secret: 'pi_demo_secret', id: 'pi_demo' };
  }
  
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert KES to cents
    currency: 'kes',
    metadata
  });
};

module.exports = { createPaymentIntent, stripe };
