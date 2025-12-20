import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import { connectDB } from './src/server/config/database';
import jobsRouter from './src/server/routes/jobs';
import appliedJobsRouter from './src/server/routes/appliedJobs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const distPath = path.join(__dirname, 'dist');
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (!existsSync(distPath)) {
    console.error('⚠️  WARNING: dist folder not found! Frontend may not be built.');
  }
  
  // Explicit root route handler - MUST come before static middleware
  app.get('/', (_req, res) => {
    try {
      const htmlContent = readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(htmlContent);
    } catch (err) {
      console.error('Error serving root:', err);
      res.status(500).send('Error loading application');
    }
  });
  
  // Serve static files from dist folder (assets, etc.)
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    index: false
  }));
}

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
  
  if (!existsSync(indexPath)) {
    console.error('CRITICAL: index.html not found at:', indexPath);
  }
  
  // Catch-all handler: send back React's index.html file for all non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    try {
      const htmlContent = readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(htmlContent);
    } catch (err) {
      console.error('Error reading/sending index.html:', err);
      if (!res.headersSent) {
        res.status(500).send('Error loading application');
      }
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
