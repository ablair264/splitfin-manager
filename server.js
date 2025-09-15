require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { shopifyApi } = require('@shopify/shopify-api');
const { ApiVersion } = require('@shopify/shopify-api');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'https://beautiful-bunny-e56a51.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173' // Vite default port
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES.split(','),
  hostName: process.env.SHOPIFY_APP_URL.replace(/https?:\/\//, ''),
  apiVersion: ApiVersion.January24,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }

  const authRoute = await shopify.auth.begin({
    shop,
    callbackPath: '/auth/callback',
    isOnline: false,
  });

  res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
  try {
    const callback = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    req.session.shop = callback.session.shop;
    req.session.accessToken = callback.session.accessToken;

    // Redirect to frontend app
    const frontendUrl = process.env.FRONTEND_URL || 'https://beautiful-bunny-e56a51.netlify.app';
    res.redirect(`${frontendUrl}/?shop=${callback.session.shop}&authenticated=true`);
  } catch (error) {
    console.error('Error during auth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/shop', async (req, res) => {
  const { shop, accessToken } = req.session;
  
  if (!shop || !accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const client = new shopify.clients.Rest({ session: { shop, accessToken } });
  
  try {
    const shopData = await client.get({ path: 'shop' });
    res.json(shopData.body);
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Failed to fetch shop data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});