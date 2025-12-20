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
  
  app.use(express.static(distPath));
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

app.use('/api', jobsRouter);
app.use('/api', appliedJobsRouter);

if (isProduction) {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (isProduction) {
    console.log('Serving production build');
  }
});
