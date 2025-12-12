import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Trust Vercel Proxy (Required for rate-limit and correct IP detection)
app.set('trust proxy', 1);

// CORS - Must be first
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Headers
app.use(helmet());

// Compression
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

import routes from './routes';

app.get('/', (req, res) => {
  res.send('Ticket Booking API is running');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
