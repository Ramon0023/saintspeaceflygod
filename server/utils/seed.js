require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saintspeaceflygod');
    console.log('MongoDB Connected to seed data');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

const productsData = [
  // Collection 1: Fallen Angels
  { name: 'Seraph Hoodie', collectionName: 'Fallen Angels', price: 85, sizes: ['M','L','XL'], colors: [{name:'Void Black', hex:'#000'}], stock: 50, status: 'active', description: 'Heavyweight organic cotton hoodie with fallen angel motif.', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Wingspan Longsleeve', collectionName: 'Fallen Angels', price: 55, sizes: ['S','M','L'], colors: [{name:'Ash', hex:'#b2b2b2'}], stock: 40, status: 'active', description: 'Extended sleeves with ethereal graphics.', images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Halo Broken Cap', collectionName: 'Fallen Angels', price: 45, sizes: ['M'], colors: [{name:'Black', hex:'#000'}], stock: 100, status: 'active', description: 'Distressed trucker cap with embroidered broken halo.', images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Lucifer Denim Jacket', collectionName: 'Fallen Angels', price: 160, sizes: ['L','XL'], colors: [{name:'Washed Black', hex:'#222'}], stock: 20, status: 'active', description: 'Premium washed denim with laser-etched wings.', images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop'] },
  
  // Collection 2: Elevated
  { name: 'Ascension Tee', collectionName: 'Elevated', price: 50, sizes: ['S','M','L','XL'], colors: [{name:'White', hex:'#fff'}, {name:'Black', hex:'#000'}], stock: 80, status: 'active', description: 'Signature heavy cotton tee. "Dream to inspire" on back.', images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Cloudwalk Sneakers', collectionName: 'Elevated', price: 210, sizes: ['S'], colors: [{name:'Bone', hex:'#e3dac9'}], stock: 15, status: 'active', description: 'Chunky sole sneakers designed for literal elevation.', images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Purity Trousers', collectionName: 'Elevated', price: 110, sizes: ['S','M','L'], colors: [{name:'Off-White', hex:'#f8f8f8'}], stock: 35, status: 'active', description: 'Wide-leg flowing trousers. Breathable and elegant.', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Elevated Beanie', collectionName: 'Elevated', price: 35, sizes: ['M'], colors: [{name:'Violet', hex:'#9333EA'}], stock: 150, status: 'active', description: 'Soft knit beanie with central logo embroidery.', images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=600&auto=format&fit=crop'] },

  // Collection 3: Dreamstate
  { name: 'Violet Drift Jacket', collectionName: 'Dreamstate', price: 190, sizes: ['M','L','XL'], colors: [{name:'Deep Purple', hex:'#4b0082'}], stock: 25, status: 'active', description: 'Waterproof shell jacket with reflective branding.', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Lucid Cargos', collectionName: 'Dreamstate', price: 130, sizes: ['S','M','L'], colors: [{name:'Black', hex:'#000'}, {name:'Olive', hex:'#556b2f'}], stock: 45, status: 'active', description: 'Multi-pocket cargo pants with strap details.', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Sleepwalker Sweater', collectionName: 'Dreamstate', price: 105, sizes: ['M','L','XL','XXL'], colors: [{name:'Grey', hex:'#808080'}], stock: 60, status: 'active', description: 'Oversized distressed knit sweater.', images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Aura Socks', collectionName: 'Dreamstate', price: 20, sizes: ['M'], colors: [{name:'Purple/White', hex:'#9333EA'}], stock: 200, status: 'active', description: 'Thick ribbed socks. 3-pack.', images: ['https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=600&auto=format&fit=crop'] },

  // Collection 4: The Chosen
  { name: 'Third Eye Puffer', collectionName: 'The Chosen', price: 240, sizes: ['L','XL'], colors: [{name:'Black', hex:'#000'}], stock: 10, status: 'active', description: 'Ultra-warm cropped puffer jacket. Down insulated.', images: ['https://images.unsplash.com/photo-1544022613-e87ca7cebb18?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Grace Oversized Tee', collectionName: 'The Chosen', price: 60, sizes: ['S','M','L','XL'], colors: [{name:'Washed Vintage', hex:'#333'}], stock: 100, status: 'active', description: 'Boxy fit tee with vintage wash effect.', images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Prophet Boots', collectionName: 'The Chosen', price: 280, sizes: ['M','L'], colors: [{name:'Black Leather', hex:'#0f0f0f'}], stock: 20, status: 'active', description: 'Combat boots with chunky metal hardware.', images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Crown of Thorns Ring', collectionName: 'The Chosen', price: 75, sizes: ['S','M'], colors: [{name:'Silver', hex:'#c0c0c0'}], stock: 50, status: 'active', description: '925 silver oxidized ring with thorn detailing.', images: ['https://images.unsplash.com/photo-1605100804763-247f67b254a6?q=80&w=600&auto=format&fit=crop'] },

  // Collection 5: Ethereal
  { name: 'Wraith Cape', collectionName: 'Ethereal', price: 320, sizes: ['M','L'], colors: [{name:'Midnight Black', hex:'#0D001A'}], stock: 15, status: 'active', description: 'Avant-garde wool blend cape with structured shoulders.', images: ['https://images.unsplash.com/photo-1512413914488-828551b9e27c?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Ghost Layered Top', collectionName: 'Ethereal', price: 85, sizes: ['S','M','L','XL'], colors: [{name:'Ash White', hex:'#f5f5f5'}], stock: 60, status: 'active', description: 'Sheer mesh long sleeve layered over a distressed tank.', images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=600&auto=format&fit=crop'] },
  { name: 'Abyss Combat Trousers', collectionName: 'Ethereal', price: 150, sizes: ['M','L','XL'], colors: [{name:'Void Black', hex:'#000'}], stock: 35, status: 'active', description: 'Technical fabric trousers with elongated straps.', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop'] }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Destroying all existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Creating Admin User...');
    const adminUser = await User.create({
      name: 'Admin Saints',
      email: process.env.ADMIN_DEFAULT_EMAIL || 'rmuiagaiii44@gmail.com',
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMeImmediately2025!',
      role: 'admin',
      isVerified: true,
      phone: '254718801681'
    });

    console.log('Creating Test Users...');
    const users = await Promise.all([
      User.create({ name: 'John Doe',    email: 'john@example.com',  password: 'Password123!', phone: '254711111111' }),
      User.create({ name: 'Jane Smith',  email: 'jane@example.com',  password: 'Password123!', phone: '254722222222' }),
      User.create({ name: 'Alice Cooper',email: 'alice@example.com', password: 'Password123!', phone: '254733333333' })
    ]);

    console.log('Creating Products...');
    const products = [];
    for (const p of productsData) {
      products.push(await Product.create(p));
    }

    console.log('Creating Fake Orders...');
    const orderData = [];
    for (let i = 0; i < 5; i++) {
        // Skip first user, as it's John Doe? Actually doesn't matter.
      const orderUser = users[i % users.length];
      const p1 = products[i];
      const p2 = products[i + 1];
      
      let subtotal = p1.price + p2.price;
      
      orderData.push({
        orderNumber: `SPF-20260330-${1000 + i}`,
        user: orderUser._id,
        items: [
          { product: p1._id, name: p1.name, price: p1.price, size: 'M', color: p1.colors[0].name, quantity: 1, image: p1.images[0] },
          { product: p2._id, name: p2.name, price: p2.price, size: 'L', color: p2.colors[0].name, quantity: 1, image: p2.images[0] }
        ],
        shippingAddress: { firstName: orderUser.name.split(' ')[0], lastName: orderUser.name.split(' ')[1] || '', phone: orderUser.phone, address1: '123 Fake St', city: 'Nairobi', country: 'Kenya', postalCode: '00100' },
        subtotal,
        shipping: 12,
        tax: Math.round(subtotal * 0.05),
        total: subtotal + 12 + Math.round(subtotal * 0.05),
        paymentMethod: i % 2 === 0 ? 'mpesa' : 'card',
        paymentStatus: 'paid',
        orderStatus: i === 0 ? 'processing' : 'delivered'
      });
    }
    
    await Order.insertMany(orderData);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

seedData();
