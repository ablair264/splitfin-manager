require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { shopifyApi, ApiVersion } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2024-01');
const axios = require('axios');

// Import Node.js adapter
require('@shopify/shopify-api/adapters/node');

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Shopify API
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [
    'read_products', 'write_products', 
    'read_inventory', 'write_inventory',
    'read_orders', 'write_orders',
    'read_customers', 'write_customers',
    'read_analytics', 'read_files', 'write_files'
  ],
  hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, '') || 'localhost',
  apiVersion: ApiVersion.January24,
  restResources,
});

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'https://beautiful-bunny-e56a51.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start OAuth flow
app.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  try {
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false,
    });

    res.redirect(authRoute);
  } catch (error) {
    console.error('Error starting OAuth:', error);
    res.status(500).json({ error: 'Failed to start OAuth flow' });
  }
});

// OAuth callback
app.get('/auth/callback', async (req, res) => {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Store session data
    req.session.shop = callback.session.shop;
    req.session.accessToken = callback.session.accessToken;
    req.session.isAuthenticated = true;

    console.log(`OAuth successful for shop: ${callback.session.shop}`);

    // Redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || 'https://beautiful-bunny-e56a51.netlify.app';
    res.redirect(`${frontendUrl}/?shop=${callback.session.shop}&authenticated=true`);
  } catch (error) {
    console.error('Error during auth callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'https://beautiful-bunny-e56a51.netlify.app';
    res.redirect(`${frontendUrl}/?error=auth_failed`);
  }
});

// Get shop information
app.get('/api/shop', async (req, res) => {
  const { shop, accessToken } = req.session;
  
  if (!shop || !accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const client = new shopify.clients.Rest({ session: { shop, accessToken } });
    const shopData = await client.get({ path: 'shop' });
    
    res.json({
      shop: shopData.body.shop,
      authenticated: true
    });
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Failed to fetch shop data' });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  const { shop, accessToken } = req.session;
  
  if (!shop || !accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const client = new shopify.clients.Rest({ session: { shop, accessToken } });
    const products = await client.get({ 
      path: 'products',
      query: { limit: 50 }
    });
    
    res.json(products.body);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get orders
app.get('/api/orders', async (req, res) => {
  const { shop, accessToken } = req.session;
  
  if (!shop || !accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const client = new shopify.clients.Rest({ session: { shop, accessToken } });
    const orders = await client.get({ 
      path: 'orders',
      query: { limit: 50, status: 'any' }
    });
    
    res.json(orders.body);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get customers
app.get('/api/customers', async (req, res) => {
  const { shop, accessToken } = req.session;
  
  if (!shop || !accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const client = new shopify.clients.Rest({ session: { shop, accessToken } });
    const customers = await client.get({ 
      path: 'customers',
      query: { limit: 50 }
    });
    
    res.json(customers.body);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🛍️  Shopify App URL: ${process.env.SHOPIFY_APP_URL}`);
});