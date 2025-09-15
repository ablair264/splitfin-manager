# Splitfin Shopify Backend

This is the backend API server for the Splitfin Shopify app, designed to run on Render.

## Features

- Shopify OAuth authentication
- REST API endpoints for Shopify resources
- Session management
- CORS configuration for frontend
- Health check endpoint

## API Endpoints

### Authentication
- `GET /auth?shop=yourstore.myshopify.com` - Start Shopify OAuth flow
- `GET /auth/callback` - OAuth callback (handled by Shopify)
- `POST /api/logout` - Logout and destroy session

### Shop Data
- `GET /api/shop` - Get authenticated shop information
- `GET /api/products` - Get products from Shopify
- `GET /api/orders` - Get orders from Shopify
- `GET /api/customers` - Get customers from Shopify

### Utility
- `GET /health` - Health check endpoint

## Environment Variables

Set these in your Render dashboard:

```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://beautiful-bunny-e56a51.netlify.app
FRONTEND_URL=https://beautiful-bunny-e56a51.netlify.app
SESSION_SECRET=your_secure_random_string
NODE_ENV=production
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables above
6. Deploy!

## Local Development

```bash
npm install
npm run dev
```

## Shopify App Configuration

In your Shopify Partner dashboard, set:
- App URL: `https://your-app.onrender.com`
- OAuth callback URL: `https://your-app.onrender.com/auth/callback`