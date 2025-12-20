import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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
  app.use(express.static(path.join(__dirname, 'dist')));
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
