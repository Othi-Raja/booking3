import pool from './config/db';
import fs from 'fs';
import path from 'path';

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, 'models', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database', err);
    process.exit(1);
  }
};

initDb();
