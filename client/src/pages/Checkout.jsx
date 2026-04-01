import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo');

function StripeCheckoutForm({ clientSecret, onSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: "if_required",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setError('Unexpected status: ' + paymentIntent.status);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="pt-4 flex gap-4">
        <Button type="button" variant="secondary" onClick={onBack} disabled={loading}>Back</Button>
        <Button type="submit" className="flex-1 tracking-widest uppercase" isLoading={loading}>
          Pay via Stripe
        </Button>
      </div>
    </form>
  );
}

export default function Checkout() {
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal, shipping, tax, total } = getTotals();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', phone: '', address1: '', city: '', country: 'Kenya', postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [mpesaPendingOrder, setMpesaPendingOrder] = useState(null);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif italic text-3xl mb-4">Your cart is empty.</h1>
        <Button onClick={() => navigate('/collections')}>Return to Archives</Button>
      </div>
    );
  }

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const processPayment = async () => {
    setLoading(true);
    try {
      // 1. Create the Order
      const orderPayload = {
        items: items.map(i => ({
          product: i.product._id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0],
          size: i.size,
          color: i.color
        })),
        shippingAddress: shippingData,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total
      };

      const { data: order } = await axios.post('/api/orders', orderPayload);

      // 2. Process Payment based on method
      if (paymentMethod === 'mpesa') {
        const phoneFormat = shippingData.phone.startsWith('0') ? '254' + shippingData.phone.substring(1) : shippingData.phone;
        await axios.post('/api/payments/mpesa/initiate', {
          orderId: order._id,
          phone: phoneFormat,
          amount: total
        });
        toast.success(`Check your phone ${phoneFormat} for the STK prompt!`);
        setMpesaPendingOrder(order._id);
        setLoading(false);
      } else {
        const { data } = await axios.post('/api/payments/stripe/create-intent', { orderId: order._id });
        setClientSecret(data.clientSecret);
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <h1 className="font-serif italic text-4xl mb-8">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Steps */}
        <div className="flex-1">
          <div className="flex mb-8 gap-4 border-b border-[rgba(255,255,255,0.1)] pb-4">
            <button className={`font-sans tracking-widest text-sm uppercase ${step >= 1 ? 'text-[var(--color-highlight)]' : 'text-[var(--color-text-muted)]'}`}>
              1. Shipping
            </button>
            <span className="text-[var(--color-text-muted)]">/</span>
            <button className={`font-sans tracking-widest text-sm uppercase ${step === 2 ? 'text-[var(--color-highlight)]' : 'text-[var(--color-text-muted)]'}`}>
              2. Payment
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNext}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" required value={shippingData.firstName} onChange={e => setShippingData({...shippingData, firstName: e.target.value})} />
                  <Input label="Last Name" required value={shippingData.lastName} onChange={e => setShippingData({...shippingData, lastName: e.target.value})} />
                </div>
                <Input label="Phone Number (M-Pesa format eg 07...)" required value={shippingData.phone} onChange={e => setShippingData({...shippingData, phone: e.target.value})} />
                <Input label="Address" required value={shippingData.address1} onChange={e => setShippingData({...shippingData, address1: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" required value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} />
                  <Input label="Postal Code" required value={shippingData.postalCode} onChange={e => setShippingData({...shippingData, postalCode: e.target.value})} />
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full tracking-widest uppercase">Continue to Payment</Button>
                </div>
              </motion.form>
            )}

            {step === 2 && !clientSecret && !mpesaPendingOrder && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-serif italic mb-4">Select Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`glass-panel p-6 rounded-sm cursor-pointer border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'mpesa' ? 'border-[var(--color-accent)] bg-[rgba(147,51,234,0.1)]' : 'border-transparent'}`}
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold">M</div>
                    <span className="font-medium text-sm">M-Pesa</span>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`glass-panel p-6 rounded-sm cursor-pointer border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'card' ? 'border-[var(--color-accent)] bg-[rgba(147,51,234,0.1)]' : 'border-transparent'}`}
                  >
                    <div className="w-12 h-12 bg-[var(--color-text-muted)] rounded-full flex items-center justify-center font-bold text-black">C</div>
                    <span className="font-medium text-sm">Credit Card</span>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1 tracking-widest uppercase" onClick={processPayment} isLoading={loading}>
                    {paymentMethod === 'mpesa' ? 'Initiate STK Push' : 'Proceed via Stripe'}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && clientSecret && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Elements stripe={stripePromise} options={{ 
                  clientSecret, 
                  appearance: { 
                    theme: 'night',
                    variables: {
                      colorPrimary: '#9333EA',
                      colorBackground: '#0a0014',
                      colorText: '#ffffff',
                      colorDanger: '#ef4444',
                      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }
                  } 
                }}>
                  <StripeCheckoutForm 
                    clientSecret={clientSecret} 
                    onSuccess={() => { toast.success('Payment successful!'); clearCart(); navigate('/profile'); }}
                    onBack={() => { setClientSecret(''); setStep(2); }}
                  />
                </Elements>
              </motion.div>
            )}

            {step === 2 && mpesaPendingOrder && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center py-8 glass-panel p-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <div className="w-8 h-8 rounded-full border-4 border-t-green-500 border-green-500/20 animate-spin"></div>
                </div>
                <h3 className="text-xl font-serif italic text-green-500 mb-2">Awaiting M-Pesa Confirmation</h3>
                <p className="text-[var(--color-text-muted)] text-sm mb-6">Please check your phone and enter your PIN to complete the transaction.</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" onClick={() => setMpesaPendingOrder(null)}>Cancel</Button>
                  <Button onClick={async () => {
                    try {
                      setLoading(true);
                      await axios.post('/api/payments/mpesa/confirm', { orderId: mpesaPendingOrder });
                      toast.success('Payment confirmed!');
                      clearCart();
                      navigate('/profile');
                    } catch(err) {
                      toast.error(err.response?.data?.message || 'Payment not received yet. Please try again.');
                      setLoading(false);
                    }
                  }} isLoading={loading}>I have paid</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-[350px] lg:w-[400px]">
          <div className="glass-panel p-6 sticky top-24">
            <h2 className="font-serif italic text-2xl mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-20 bg-black/50 rounded-sm">
                    <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 text-sm">
                    <h4 className="font-serif italic line-clamp-1">{item.product.name}</h4>
                    <p className="text-[var(--color-text-muted)]">Qty: {item.quantity} | {item.size}</p>
                    <p className="font-medium mt-1">Ksh {item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm pt-6 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex justify-between text-[var(--color-text-muted)]"><span>Subtotal</span><span>Ksh {subtotal}</span></div>
              <div className="flex justify-between text-[var(--color-text-muted)]"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Ksh ${shipping}`}</span></div>
              <div className="flex justify-between text-[var(--color-text-muted)]"><span>Estimated Tax</span><span>Ksh {tax}</span></div>
              <div className="flex justify-between mt-2 pt-2 border-t border-[rgba(255,255,255,0.05)] text-lg font-medium"><span>Total</span><span>Ksh {total}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
