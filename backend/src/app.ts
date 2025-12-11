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

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'https://booking3-ebon.vercel.app' // Add your frontend domain here
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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
