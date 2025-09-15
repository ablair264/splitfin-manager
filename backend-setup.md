# Backend Setup for Render

## Files to Deploy to Render

Your Render backend should include:

1. **server.js** - The Express server with Shopify OAuth
2. **package.json** - Backend dependencies only
3. **.env** - Environment variables (set in Render dashboard)

## Steps to Deploy Backend to Render:

1. Create a new repository for your backend or use a separate branch
2. Copy these files:
   - `server.js`
   - Create a backend-specific `package.json`:

```json
{
  "name": "splitfin-shopify-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "@shopify/shopify-api": "^11.0.0",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

3. Set these environment variables in Render:
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `SHOPIFY_APP_URL` (your Netlify URL)
   - `SESSION_SECRET`
   - `FRONTEND_URL` (your Netlify URL)
   - `PORT` (Render will set this automatically)

4. Update your Shopify app settings:
   - Add your Render URL to allowed redirection URLs
   - OAuth callback: `https://your-app.onrender.com/auth/callback`

5. Update your frontend `.env`:
   - Set `REACT_APP_API_URL` to your Render backend URL

## Frontend Updates Needed:

1. In Netlify, add environment variable:
   - `REACT_APP_API_URL` = Your Render backend URL

2. The frontend will now:
   - Send auth requests to your Render backend
   - Make API calls to your Render backend
   - Handle redirects from Shopify OAuth

## Testing:

1. Deploy backend to Render
2. Update frontend environment variables
3. Redeploy frontend on Netlify
4. Test the OAuth flow