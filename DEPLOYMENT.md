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
2. Railway will create a MongoDB instance and provide a connection string

### Step 4: Configure Environment Variables

In your Railway project settings, add these environment variables:

```
RAPIDAPI_KEY=your_rapidapi_key_here
MONGODB_URI=your_mongodb_connection_string_from_railway
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-app-name.railway.app
VITE_API_BASE_URL=https://your-app-name.railway.app/api
```

**Important:** For the frontend to work, you also need to set `VITE_API_BASE_URL` as a build-time variable. Railway will automatically use this during the build.

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
- Check if MongoDB instance is running
- Ensure network access is allowed (if using cloud MongoDB)

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

