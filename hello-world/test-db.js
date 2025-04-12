const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'christian',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moviebook',
  });

  try {
    console.log('Attempting to connect to the database...');
    await client.connect();
    console.log('Successfully connected to the database!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    
    await client.end();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

testConnection(); 