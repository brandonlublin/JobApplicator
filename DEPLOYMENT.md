# Deployment Guide

This guide will help you deploy JobApplicator to production. We'll use **Railway** as it's the easiest option for full-stack apps with MongoDB.

## Prerequisites

- A GitHub account
- A RapidAPI account with JSearch API key
- A MongoDB database (Railway can provision this automatically)

## Option 1: Railway (Recommended)

Railway is the easiest option as it handles both your app and MongoDB in one place.

### Step 1: Prepare Your Repository

1. Make sure your code is pushed to GitHub
2. Ensure you have a `.env.example` file (already created)

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `JobApplicator` repository
4. Railway will automatically detect it's a Node.js app

### Step 3: Add MongoDB

1. In your Railway project, click "+ New" → "Database" → "Add MongoDB"
2. Railway will create a MongoDB instance
3. **To find the connection string:**
   - Click on the MongoDB service in your Railway project
   - Go to the "Variables" tab
   - Look for `MONGO_URL` or `MONGODB_URL` - this is your connection string
   - Copy this value (it will look like: `mongodb://mongo:27017/...` or `mongodb+srv://...`)

### Step 4: Configure Environment Variables

1. In your Railway project, click on your **web service** (not the MongoDB service)
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"** and add each of these:

   - **Variable:** `RAPIDAPI_KEY` | **Value:** `your_rapidapi_key_here`
   - **Variable:** `MONGODB_URI` | **Value:** `paste_the_connection_string_from_step_3`
   - **Variable:** `NODE_ENV` | **Value:** `production`
   - **Variable:** `CLIENT_URL` | **Value:** `https://your-app-name.railway.app` (update after first deploy)
   - **Variable:** `VITE_API_BASE_URL` | **Value:** `https://your-app-name.railway.app/api` (update after first deploy)

**Important Notes:**
- After adding `MONGODB_URI`, Railway will automatically redeploy
- For `VITE_API_BASE_URL`: This needs to be set **before** the build runs. You may need to trigger a redeploy after setting it
- If you get an API key error, make sure:
  1. The variable name is exactly `RAPIDAPI_KEY` (case-sensitive)
  2. There are no extra spaces in the value
  3. You've redeployed after adding the variable (Railway usually does this automatically)

### Step 5: Deploy

1. Railway will automatically build and deploy your app
2. Once deployed, Railway will give you a URL like `https://your-app-name.railway.app`
3. Your app should be live!

### Step 6: Update CORS (if needed)

If you're using a custom domain, update `CLIENT_URL` in Railway to match your domain.

---

## Option 2: Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com) and sign up

### Step 2: Deploy Backend

1. Click "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name:** jobapplicator-backend
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Environment Variables:**
     ```
     RAPIDAPI_KEY=your_key
     MONGODB_URI=your_mongodb_uri
     NODE_ENV=production
     PORT=10000
     ```

### Step 3: Deploy Frontend

1. Click "New" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
     ```

### Step 4: Add MongoDB

1. Click "New" → "MongoDB"
2. Render will create a MongoDB instance
3. Copy the connection string to your backend environment variables

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_BASE_URL=https://your-backend-url/api
     ```

### Backend on Railway/Render

Follow the backend deployment steps from Option 1 or 2.

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `RAPIDAPI_KEY` | Your RapidAPI JSearch API key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (Railway/Render sets this automatically) | No |
| `NODE_ENV` | Set to `production` | Yes (production) |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `VITE_API_BASE_URL` | Backend API URL (for frontend) | Yes |

---

## Troubleshooting

### Frontend can't connect to backend

- Make sure `VITE_API_BASE_URL` is set correctly
- Check CORS settings in `server.ts`
- Verify your backend is running and accessible

### MongoDB connection issues

- Verify `MONGODB_URI` is correct
- **To find MongoDB connection string in Railway:**
  1. Click on your MongoDB service (not the web service)
  2. Go to "Variables" tab
  3. Look for `MONGO_URL` or `MONGODB_URL` 
  4. Copy that value to your web service's `MONGODB_URI` variable
- Check if MongoDB instance is running
- Ensure network access is allowed (if using cloud MongoDB)

### API Key not found error

If you see "API key is missing from environment variables" even after adding `RAPIDAPI_KEY`:

1. **Check the variable name:** It must be exactly `RAPIDAPI_KEY` (case-sensitive, no spaces)
2. **Check the variable location:** Make sure it's in your **web service** variables, not the MongoDB service
3. **Redeploy:** After adding the variable, Railway should auto-redeploy, but you can manually trigger one:
   - Go to your web service → "Deployments" tab → Click "Redeploy"
4. **Check logs:** Go to "Deployments" → Click on the latest deployment → Check the logs to see if the variable is being read
5. **Verify the value:** Make sure there are no extra spaces or quotes in the API key value

### Build fails

- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally first
- Check Railway/Render build logs for specific errors

---

## Getting Your RapidAPI Key

1. Go to [rapidapi.com](https://rapidapi.com)
2. Sign up/login
3. Search for "JSearch" API
4. Subscribe to a plan
5. Copy your API key from the dashboard

---

## Custom Domain (Optional)

### Railway
1. Go to your project settings
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render/Vercel
Both platforms have straightforward custom domain setup in their dashboards.

---

## Need Help?

- Check Railway docs: https://docs.railway.app
- Check Render docs: https://render.com/docs
- Check Vercel docs: https://vercel.com/docs

