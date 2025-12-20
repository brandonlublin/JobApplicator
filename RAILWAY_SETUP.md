# Quick Railway Setup Guide

## Finding MongoDB Connection String

1. In your Railway project dashboard, you'll see two services:
   - Your web service (your app)
   - MongoDB service (the database)

2. **Click on the MongoDB service** (not your web service)

3. Go to the **"Variables"** tab

4. Look for one of these variables:
   - `MONGO_URL`
   - `MONGODB_URL` 
   - `DATABASE_URL`

5. **Copy the entire connection string** (it will look like: `mongodb://mongo:27017/railway` or `mongodb+srv://...`)

6. This is what you'll use for `MONGODB_URI` in your web service

## Setting Environment Variables

1. **Click on your web service** (not MongoDB)

2. Go to the **"Variables"** tab

3. Click **"+ New Variable"** for each:

### Required Variables:

| Variable Name | Value | Where to get it |
|--------------|-------|----------------|
| `RAPIDAPI_KEY` | Your RapidAPI key | From rapidapi.com dashboard |
| `MONGODB_URI` | Connection string | From MongoDB service variables (see above) |
| `NODE_ENV` | `production` | Just type this |
| `CLIENT_URL` | `https://your-app.railway.app` | Your Railway app URL |
| `VITE_API_BASE_URL` | `https://your-app.railway.app/api` | Your Railway app URL + `/api` |

## Common Issues

### "API key is missing" error

1. Make sure you're adding `RAPIDAPI_KEY` to the **web service**, not MongoDB service
2. Variable name must be exactly `RAPIDAPI_KEY` (case-sensitive)
3. No spaces before/after the value
4. After adding, Railway should auto-redeploy - if not, manually redeploy:
   - Go to "Deployments" tab
   - Click "Redeploy"

### Can't find MongoDB connection string

- Make sure you're looking at the **MongoDB service** variables, not the web service
- If you don't see it, try:
  1. Click on MongoDB service
  2. Go to "Settings" tab
  3. Look for connection info there
  4. Or check the "Connect" tab

### Variables not working after adding

- Railway needs to redeploy after adding variables
- Check the "Deployments" tab to see if a new deployment started
- If not, manually trigger a redeploy
- Check the deployment logs to see if variables are being read

## Step-by-Step Checklist

- [ ] Created Railway project from GitHub
- [ ] Added MongoDB service
- [ ] Found MongoDB connection string from MongoDB service variables
- [ ] Added `MONGODB_URI` to web service with the connection string
- [ ] Added `RAPIDAPI_KEY` to web service
- [ ] Added `NODE_ENV=production` to web service
- [ ] Got app URL from Railway (after first deploy)
- [ ] Added `CLIENT_URL` with app URL
- [ ] Added `VITE_API_BASE_URL` with app URL + `/api`
- [ ] Triggered redeploy (if needed)
- [ ] Checked deployment logs for errors

