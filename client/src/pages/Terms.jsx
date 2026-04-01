import React from 'react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-serif italic text-4xl mb-2">Terms & Conditions</h1>
      <p className="text-[var(--color-text-muted)] mb-12 text-sm">Last Updated: March 30, 2026</p>

      <div className="space-y-8 text-[var(--color-text-primary)] leading-relaxed font-sans opacity-90">
        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">1. Acceptance of Terms</h2>
          <p>By accessing and using saintspeaceflygod.com, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">2. Products & Pricing</h2>
          <p>All prices are subject to change without notice. We reserve the right to discontinue any product at any time. We have made every effort to display as accurately as possible the colors and images of our products.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">3. Payments (M-Pesa & Card)</h2>
          <p>We accept payments via M-Pesa natively in Kenya and through Stripe for international card payments. Goods will only be dispatched upon full confirmation of payment receipt. By initiating a payment, you authorize us to charge the specified amount.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">4. Intellectual Property</h2>
          <p>The brand name "Saintspeaceflygod™", motto "dream to inspire", all designs, graphics, and text are the intellectual property of the brand and cannot be reproduced without explicit permission.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">5. Returns & Refunds</h2>
          <p>Items may be returned within 14 days of delivery if unworn, unwashed, and with all original tags attached. Refunds will be processed to the original method of payment.</p>
        </section>
      </div>
    </div>
  );
}
