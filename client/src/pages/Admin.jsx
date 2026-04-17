import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, Package, ShoppingCart, Activity, Edit, Trash2, Mail, Bell, Settings, CheckCircle, Clock } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';

export default function Admin() {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [settings, setSettings] = useState({});

  // Product Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', compareAtPrice: '', 
    collectionName: 'Fallen Angels', stock: '', status: 'active', 
    images: '', sizes: 'S,M,L,XL', colors: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await axios.get('/api/admin/dashboard-stats');
        setStats(res.data);
      } else if (activeTab === 'users') {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'products') {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } else if (activeTab === 'orders') {
        const res = await axios.get('/api/orders/admin/all');
        setOrders(res.data);
      } else if (activeTab === 'messages') {
        const res = await axios.get('/api/admin/messages');
        setMessages(res.data);
      } else if (activeTab === 'subscribers') {
        const res = await axios.get('/api/admin/subscribers');
        setSubscribers(res.data);
      } else if (activeTab === 'settings') {
        const res = await axios.get('/api/admin/settings');
        setSettings(res.data);
      }
    } catch {
      toast.error('Failed to synchronize with the void.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const handleUpdateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      await axios.put(`/api/orders/admin/${orderId}/status`, { orderStatus, paymentStatus });
      toast.success('Order status updated.');
      if (activeTab === 'orders') fetchData();
      if (selectedOrder) setSelectedOrder({ ...selectedOrder, orderStatus, paymentStatus });
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleMarkMessageRead = async (id) => {
    try {
      await axios.put(`/api/admin/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
      toast.success('Transmission marked as read.');
    } catch {
      toast.error('Failed to update message.');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put('/api/admin/settings', settings);
      toast.success('System settings calibrated.');
    } catch {
      toast.error('Calibration failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice || '',
        collectionName: product.collectionName,
        stock: product.stock,
        status: product.status,
        images: product.images.join(', '),
        sizes: product.sizes.join(','),
        colors: product.colors.map(c => `${c.name}:${c.hex}`).join(',')
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', description: '', price: '', compareAtPrice: '', 
        collectionName: 'Fallen Angels', stock: '', status: 'active', 
        images: '', sizes: 'S,M,L,XL', colors: ''
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
        stock: Number(productForm.stock),
        images: productForm.images.split(',').map(s => s.trim()).filter(Boolean),
        sizes: productForm.sizes.split(',').map(s => s.trim().toUpperCase()).filter(Boolean),
        colors: productForm.colors.split(',').map(s => {
          const [name, hex] = s.split(':');
          return name && hex ? { name: name.trim(), hex: hex.trim() } : null;
        }).filter(Boolean)
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
        toast.success('Manifestation updated.');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Manifestation created.');
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product erased.');
      fetchData();
    } catch {
      toast.error('Deletion failed.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="font-serif italic text-4xl mb-2 text-[var(--color-highlight)]">Command Center</h1>
          <p className="text-[var(--color-text-muted)] tracking-widest uppercase text-sm">Official System Oversight</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
            Sign Out
          </Button>
          <div className="h-8 w-px bg-white/10 hidden xl:block"></div>
          <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {['dashboard', 'products', 'orders', 'users', 'messages', 'subscribers', 'settings'].map(tab => (
            <Button 
              key={tab} 
              variant={activeTab === tab ? 'primary' : 'ghost'} 
              onClick={() => setActiveTab(tab)} 
              size="sm"
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center"><Spinner size="lg" /></div>
      ) : activeTab === 'dashboard' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-panel p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Total Revenue</h3>
                <Activity className="text-[var(--color-accent)]" size={20} />
              </div>
              <p className="text-3xl font-serif italic">Ksh {stats?.totalRevenue || 0}</p>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Total Orders</h3>
                <ShoppingCart className="text-[var(--color-accent)]" size={20} />
              </div>
              <p className="text-3xl font-serif italic">{stats?.totalOrders || 0}</p>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Products</h3>
                <Package className="text-[var(--color-accent)]" size={20} />
              </div>
              <p className="text-3xl font-serif italic">{stats?.totalProducts || 0}</p>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Active Users</h3>
                <Users className="text-[var(--color-accent)]" size={20} />
              </div>
              <p className="text-3xl font-serif italic">{stats?.totalUsers || 0}</p>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="font-sans font-semibold border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6">Recent Orders</h2>
            {stats?.recentOrders?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[var(--color-text-muted)] uppercase bg-black/20 font-sans">
                    <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Total</th></tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map(order => (
                      <tr key={order._id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-black/10 cursor-pointer" onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}>
                        <td className="px-4 py-3 font-mono">{order.orderNumber}</td>
                        <td className="px-4 py-3">{order.user?.name || 'Guest'}</td>
                        <td className="px-4 py-3"><span className="text-xs uppercase tracking-widest text-[var(--color-highlight-bright)]">{order.orderStatus}</span></td>
                        <td className="px-4 py-3">Ksh {order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-center py-10 opacity-50 font-serif italic">The void is silent.</p>}
          </div>
        </motion.div>
      ) : activeTab === 'orders' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
           <h2 className="font-sans font-semibold border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6">Order Archives</h2>
           <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[var(--color-text-muted)] uppercase bg-black/20 font-sans">
                    <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Total</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-black/10 cursor-pointer" onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}>
                        <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{order.user?.name}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>{order.paymentStatus}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs uppercase text-[var(--color-highlight-bright)]">{order.orderStatus}</td>
                        <td className="px-4 py-3">Ksh {order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
           </div>
        </motion.div>
      ) : activeTab === 'messages' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {messages.map(msg => (
            <div key={msg._id} className={`glass-panel p-6 relative overflow-hidden ${!msg.isRead ? 'border-l-2 border-[var(--color-accent)]' : 'opacity-60'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif italic text-xl">{msg.subject}</h3>
                  <p className="text-sm text-[var(--color-highlight-bright)]">{msg.name} ({msg.email})</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  {!msg.isRead && (
                    <Button size="sm" variant="secondary" onClick={() => handleMarkMessageRead(msg._id)}>Mark as Read</Button>
                  )}
                </div>
              </div>
              <p className="text-[var(--color-text-primary)] leading-relaxed italic border-t border-white/5 pt-4">"{msg.message}"</p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-center py-20 opacity-50 font-serif italic">No transmissions received.</p>}
        </motion.div>
      ) : activeTab === 'subscribers' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
           <h2 className="font-sans font-semibold border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6">Initiated Subscribers</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribers.map(s => (
                <div key={s._id} className="p-4 bg-black/20 border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{s.email}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">{new Date(s.createdAt).toLocaleDateString()} | {s.source}</p>
                  </div>
                </div>
              ))}
           </div>
        </motion.div>
      ) : activeTab === 'settings' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
          <form className="glass-panel p-8 space-y-6" onSubmit={handleUpdateSettings}>
             <h2 className="font-serif italic text-3xl border-b border-white/5 pb-4 mb-6 flex items-center gap-3">
               <Settings className="text-[var(--color-accent)]" /> Global Config
             </h2>
             <Input 
                label="Site Announcement Banner" 
                placeholder="FREE SHIPPING ON ALL ORDERS OVER KSH 100"
                value={settings.announcement_banner || ''}
                onChange={e => setSettings({...settings, announcement_banner: e.target.value})}
             />
             <div className="flex flex-col">
                <label className="mb-1 text-sm text-[var(--color-text-muted)] font-sans uppercase tracking-widest">Maintenance Mode</label>
                <select 
                  className="w-full bg-[rgba(14,0,26,0.5)] border border-[rgba(147,51,234,0.2)] rounded-sm px-4 py-2 text-white focus:outline-none focus:border-[var(--color-highlight)]"
                  value={settings.maintenance_mode || 'false'}
                  onChange={e => setSettings({...settings, maintenance_mode: e.target.value})}
                >
                  <option value="false" className="text-black">Online (Active)</option>
                  <option value="true" className="text-black">Offline (Maintenance)</option>
                </select>
             </div>
             <Input 
                label="M-Pesa Business Name" 
                value={settings.mpesa_name || 'SAINTSPEACEFLYGOD'}
                onChange={e => setSettings({...settings, mpesa_name: e.target.value})}
             />
             <Button type="submit" className="w-full uppercase tracking-widest" isLoading={isSaving}>Save Calibration</Button>
          </form>
        </motion.div>
      ) : activeTab === 'products' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif italic text-3xl">Manifestations</h2>
            <Button size="sm" className="flex items-center gap-2" onClick={() => handleOpenProductModal()}>
              <Plus size={16} /> Create New
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p._id} className="glass-panel p-4 flex flex-col group border border-white/5 hover:border-[var(--color-accent)]/30 transition-all">
                <div className="aspect-[3/4] overflow-hidden mb-4 bg-black/50 rounded-sm">
                  <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 mb-4">
                  <h4 className="font-serif italic text-xl mb-1">{p.name}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-2">{p.collectionName}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="font-sans font-medium text-[var(--color-highlight-bright)]">Ksh {p.price}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm uppercase ${p.stock > 0 ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenProductModal(p)} className="flex-1 py-2 text-xs bg-white/5 hover:bg-white/10 transition-colors rounded-sm flex items-center justify-center gap-2"><Edit size={14}/> Edit</button>
                  <button onClick={() => handleDeleteProduct(p._id)} className="flex-1 py-2 text-xs bg-red-500/5 hover:bg-red-500/10 text-red-400/70 transition-colors rounded-sm flex items-center justify-center gap-2"><Trash2 size={14}/> Remove</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : activeTab === 'users' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-6">
          <h2 className="font-sans font-semibold border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6">User Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left font-sans">
              <thead className="text-[var(--color-text-muted)] uppercase bg-black/20">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-black/10">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{u.email}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[10px] rounded-sm uppercase ${u.role === 'admin' ? 'bg-[var(--color-accent)]' : 'bg-gray-500/20'}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`text-[10px] uppercase ${u.isSuspended ? 'text-red-400' : 'text-green-400'}`}>{u.isSuspended ? 'Suspended' : 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : null}

      {/* Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? 'Edit Manifestation' : 'New Manifestation'} maxWidth="max-w-2xl">
        <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
            <div className="flex flex-col"><label className="mb-1 text-sm text-[var(--color-text-muted)] uppercase text-[10px] tracking-widest">Collection</label>
              <select className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-white focus:border-[var(--color-accent)]" value={productForm.collectionName} onChange={e => setProductForm({...productForm, collectionName: e.target.value})}>
                <option value="Fallen Angels" className="text-black">Fallen Angels</option><option value="Elevated" className="text-black">Elevated</option><option value="Dreamstate" className="text-black">Dreamstate</option><option value="The Chosen" className="text-black">The Chosen</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col"><label className="mb-1 text-sm text-[var(--color-text-muted)] uppercase text-[10px] tracking-widest">Description</label>
            <textarea required rows="3" className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-white focus:border-[var(--color-accent)]" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}></textarea>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Price (Ksh)" type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
            <Input label="Compare At" type="number" value={productForm.compareAtPrice} onChange={e => setProductForm({...productForm, compareAtPrice: e.target.value})} />
            <Input label="Stock" type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
          </div>
          <Input label="Images (URLs, comma separated)" required value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sizes" value={productForm.sizes} onChange={e => setProductForm({...productForm, sizes: e.target.value})} />
            <Input label="Colors (Name:Hex)" value={productForm.colors} onChange={e => setProductForm({...productForm, colors: e.target.value})} />
          </div>
          <div className="flex flex-col"><label className="mb-1 text-sm text-[var(--color-text-muted)] uppercase text-[10px] tracking-widest">Status</label>
            <select className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-white focus:border-[var(--color-accent)]" value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value})}>
              <option value="active" className="text-black">Active</option><option value="draft" className="text-black">Draft</option>
            </select>
          </div>
          <Button type="submit" className="w-full" isLoading={isSaving}>{editingProduct ? 'Update Manifestation' : 'Create Manifestation'}</Button>
        </form>
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={`Order Details: ${selectedOrder?.orderNumber}`} maxWidth="max-w-3xl">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-1"><h4 className="text-[var(--color-text-muted)] uppercase text-[10px] tracking-widest mb-2">Shipping Information</h4>
                <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                <p>{selectedOrder.shippingAddress.address1}</p><p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                <p className="pt-2 font-mono text-[var(--color-accent)]">{selectedOrder.shippingAddress.phone}</p>
              </div>
              <div className="space-y-1"><h4 className="text-[var(--color-text-muted)] uppercase text-[10px] tracking-widest mb-2">Order Configuration</h4>
                <div className="flex gap-2 mb-3">
                  <select className="bg-black/40 border border-white/10 rounded-sm text-xs p-1" value={selectedOrder.orderStatus} onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value, selectedOrder.paymentStatus)}>
                    {['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                  <select className="bg-black/40 border border-white/10 rounded-sm text-xs p-1" value={selectedOrder.paymentStatus} onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, selectedOrder.orderStatus, e.target.value)}>
                    {['pending', 'paid', 'failed', 'refunded'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
                <p>Method: <span className="uppercase text-[var(--color-highlight-bright)]">{selectedOrder.paymentMethod}</span></p>
                <p>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-[var(--color-text-muted)] uppercase text-[10px] tracking-widest mb-4">Items Manifest</h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center bg-black/20 p-2 rounded-sm">
                    <img src={item.image} className="w-12 h-16 object-cover rounded-sm" />
                    <div className="flex-1"><p className="font-serif italic text-lg">{item.name}</p><p className="text-xs text-[var(--color-text-muted)]">{item.size} | Ksh {item.price}</p></div>
                    <div className="text-right font-mono">x{item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/5 pt-4 flex justify-between items-center"><span className="text-xl font-serif italic">Total Amount</span><span className="text-2xl text-[var(--color-highlight-bright)] font-sans font-semibold">Ksh {selectedOrder.total}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
}