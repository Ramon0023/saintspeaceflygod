import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Pencil, X } from 'lucide-react';

export default function Profile() {
  const { user, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      await axios.put('/api/auth/profile', payload);
      await checkAuth(); // refresh user in store
      toast.success('Profile updated!');
      setEditing(false);
      setForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="font-serif italic text-4xl mb-2">Welcome, {user?.name}</h1>
          <p className="text-[var(--color-text-muted)] tracking-widest uppercase text-sm">
            {user?.role === 'admin' ? 'System Administrator' : 'Initiated Member'}
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
          {user?.role === 'admin' && (
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
          )}
          <Button
            variant="ghost"
            className="border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account Details */}
        <div className="md:col-span-1 glass-panel p-6 h-fit">
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-2 mb-4">
            <h2 className="font-sans font-semibold">Account Details</h2>
            <button
              onClick={() => setEditing(e => !e)}
              className="text-[var(--color-text-muted)] hover:text-white transition-colors"
              title={editing ? 'Cancel' : 'Edit Profile'}
            >
              {editing ? <X size={16} /> : <Pencil size={16} />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Name</p>
                  <p>{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Phone</p>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>
                <Button
                  variant="secondary" size="sm" className="w-full mt-2"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSave}
                className="space-y-3"
              >
                <Input
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider pt-2">
                  Change Password (optional)
                </p>
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
                />
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm" className="flex-1" isLoading={saving}>
                    Save
                  </Button>
                  <Button
                    type="button" variant="ghost" size="sm" className="flex-1"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Order History */}
        <div className="md:col-span-2 glass-panel p-6">
          <h2 className="font-sans font-semibold border-b border-[rgba(255,255,255,0.05)] pb-2 mb-4">Order History</h2>
          {loadingOrders ? (
            <div className="py-12 flex justify-center"><Spinner size="md" /></div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
              <p className="font-serif italic text-xl mb-4">No orders yet.</p>
              <Button variant="ghost" onClick={() => navigate('/collections')}>Explore the Collection</Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {orders.map(order => (
                <div key={order._id} className="border border-[rgba(255,255,255,0.05)] p-4 rounded-sm flex flex-col md:flex-row gap-4 justify-between bg-black/20">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)]">Order <span className="text-white font-mono">{order.orderNumber}</span></p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          {item.image && <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded-sm opacity-80" />}
                          <span>{item.quantity}x {item.name} <span className="text-[var(--color-text-muted)]">({item.size})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-left md:text-right flex flex-col justify-between mt-4 md:mt-0">
                    <p className="font-medium text-lg">Ksh {order.total}</p>
                    <div className="mt-3 flex gap-2 justify-start md:justify-end">
                      <span className={`text-xs px-2 py-1 rounded-sm uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-300' : order.paymentStatus === 'failed' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {order.paymentStatus}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-sm bg-[rgba(147,51,234,0.2)] text-[var(--color-highlight-bright)] uppercase tracking-wider">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
