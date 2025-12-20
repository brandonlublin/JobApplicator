import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';
import { connectDB } from './src/server/config/database';
import jobsRouter from './src/server/routes/jobs';
import appliedJobsRouter from './src/server/routes/appliedJobs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Log environment variable status (without sensitive values)
console.log('🔍 Environment check:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   PORT:', process.env.PORT || 'not set');
console.log('   RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? '✅ Set' : '❌ Not set');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('   Available env vars with "API" or "KEY":', Object.keys(process.env).filter(k => k.includes('API') || k.includes('KEY') || k.includes('RAPID')).join(', ') || 'none');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const distPath = path.join(__dirname, 'dist');
  console.log('📁 Looking for dist folder at:', distPath);
  console.log('   Current working directory:', process.cwd());
  console.log('   __dirname:', __dirname);
  
  // Check if dist folder exists
  const distExists = existsSync(distPath);
  console.log('   Dist folder exists:', distExists);
  
  if (distExists) {
    try {
      const files = readdirSync(distPath);
      console.log('   Files in dist:', files.slice(0, 10).join(', '), files.length > 10 ? '...' : '');
    } catch (err) {
      console.error('   Error reading dist folder:', err);
    }
  } else {
    console.error('   ⚠️  WARNING: dist folder not found! Frontend may not be built.');
    console.error('   Make sure "npm run build" runs before starting the server.');
  }
  
  // Serve static files from dist folder
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));
}

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

app.use(
  cors({
    origin: isProduction ? undefined : CLIENT_URL,
    methods: 'GET,POST,DELETE',
    credentials: true,
  })
);
app.use(bodyParser.json());

connectDB();

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes must come before the catch-all route
app.use('/api', jobsRouter);
app.use('/api', appliedJobsRouter);

// Serve React app for all non-API routes in production
if (isProduction) {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('📄 Index.html path:', indexPath);
  console.log('   Index.html exists:', existsSync(indexPath));
  
  if (!existsSync(indexPath)) {
    console.error('❌ CRITICAL: index.html not found at:', indexPath);
  }
  
  // Catch-all handler: send back React's index.html file for all non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    console.log(`   📄 Serving index.html for: ${req.path}`);
    
    // Serve index.html for all other routes (React Router will handle routing)
    res.sendFile(indexPath, { root: __dirname }, (err) => {
      if (err) {
        console.error('❌ Error sending index.html:', err);
        console.error('   Error message:', err.message);
        console.error('   Attempted path:', indexPath);
        if (!res.headersSent) {
          res.status(500).send('Error loading application');
        }
      } else {
        console.log(`   ✅ Successfully served index.html for: ${req.path}`);
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (isProduction) {
    console.log('Serving production build');
  }
});
