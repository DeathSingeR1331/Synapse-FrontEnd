# Environment Variables Setup for Synapse Frontend

## 🚀 Quick Setup

1. **Copy the template file:**
   ```bash
   cp env-template.txt .env
   ```

2. **Update the values in `.env`** as needed for your environment

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## 📋 Environment Variables Explained

### API Configuration
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8000)
- `VITE_WS_BASE_URL` - WebSocket URL (default: ws://localhost:8000)
- `VITE_MCP_API_URL` - MCP Chatbot API URL (default: http://localhost:8001)

### Google OAuth
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_GOOGLE_REDIRECT_URI` - OAuth callback URL

### N8N Webhook
- `VITE_N8N_WEBHOOK_URL` - N8N webhook endpoint for resume processing
- `VITE_N8N_WEBHOOK_TOKEN` - Authentication token for webhook

### Development
- `VITE_NODE_ENV` - Environment mode (development/production)
- `VITE_DEBUG` - Enable debug logging

## 🌐 Production Deployment

For production deployment (Railway/Vercel), update these values:

```bash
VITE_API_BASE_URL=https://synapse-backend.railway.app
VITE_WS_BASE_URL=wss://synapse-backend.railway.app
VITE_MCP_API_URL=https://synapse-mcp.railway.app
VITE_GOOGLE_REDIRECT_URI=https://synapse-frontend.vercel.app/auth/google/callback
VITE_NODE_ENV=production
VITE_DEBUG=false
```

## ⚠️ Important Notes

- **Never commit `.env` files** to version control
- **Use `VITE_` prefix** for all frontend environment variables
- **Restart dev server** after changing environment variables
- **Update Google OAuth** redirect URIs in Google Console for production

## 🔧 Troubleshooting

### Environment variables not loading?
1. Check that variables start with `VITE_`
2. Restart the development server
3. Check browser console for errors

### API connection issues?
1. Verify `VITE_API_BASE_URL` is correct
2. Check CORS settings on backend
3. Ensure backend is running

### OAuth not working?
1. Update redirect URIs in Google Console
2. Check `VITE_GOOGLE_CLIENT_ID` is correct
3. Verify `VITE_GOOGLE_REDIRECT_URI` matches Google Console
