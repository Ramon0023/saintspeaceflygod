import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent! We will reach out soon.');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="font-serif italic text-5xl mb-4">Connect With Us</h1>
        <p className="text-[var(--color-text-muted)]">Reach out, ascend with us.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-serif italic mb-6">Send a Transmission</h2>
          <form className="glass-panel p-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <Input type="email" label="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="flex flex-col mb-4">
              <label className="mb-1 text-sm text-[var(--color-text-muted)] font-sans">Subject</label>
              <select 
                className="w-full bg-[rgba(14,0,26,0.5)] border border-[rgba(147,51,234,0.2)] rounded-sm px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-highlight)]"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
              >
                <option value="General Inquiry" className="text-black">General Inquiry</option>
                <option value="Order Issue" className="text-black">Order Issue</option>
                <option value="Returns & Exchanges" className="text-black">Returns & Exchanges</option>
                <option value="Collaboration" className="text-black">Collaboration</option>
              </select>
            </div>
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-sm text-[var(--color-text-muted)] font-sans">Message</label>
              <textarea 
                required
                rows="5"
                className="w-full bg-[rgba(14,0,26,0.5)] border border-[rgba(147,51,234,0.2)] rounded-sm px-4 py-2 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-highlight)]"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>Send Message</Button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif italic mb-6">Direct Channels</h2>
            <div className="space-y-4 text-[var(--color-text-muted)]">
              <div className="flex items-center gap-4">
                <Mail className="text-[var(--color-accent)]" /> <span>rmuiagaiii44@gmail.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-[var(--color-accent)]" /> <span>+254 718 801 681</span>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="text-[var(--color-accent)]" /> <span>Void Terminal, Nairobi HQ</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
