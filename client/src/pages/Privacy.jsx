import React from 'react';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-serif italic text-4xl mb-2">Privacy Policy</h1>
      <p className="text-[var(--color-text-muted)] mb-12 text-sm">Last Updated: March 30, 2026</p>

      <div className="space-y-8 text-[var(--color-text-primary)] leading-relaxed font-sans opacity-90">
        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">1. Data Collection</h2>
          <p>We collect information you provide directly to us when creating an account, making a purchase, or contacting support. This includes your name, email address, phone number, and shipping address.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">2. How We Use Your Data</h2>
          <p>Your data is used specifically to fulfill orders, communicate shipping updates, and personalize your experience within the Saintspeaceflygod™ ecosystem. We do not sell your data to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">3. Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. Payment processing is handled by secure third-party gateways (Stripe and Daraja M-Pesa API); we do not directly store your credit card details or PINs.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif italic mb-4 text-[var(--color-highlight)]">4. Cookies</h2>
          <p>We use cookies (principally HTTP-only JWT tokens) to maintain your session securely and persist your authentication state across visits.</p>
        </section>
      </div>
    </div>
  );
}
