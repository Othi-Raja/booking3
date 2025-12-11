import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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
