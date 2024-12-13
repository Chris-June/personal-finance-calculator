import { config } from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '../config/db';

config(); // Load environment variables

async function initTestUser() {
  try {
    console.log('Initializing test user...');

    // Read and execute the test user seed file
    const seedPath = path.join(__dirname, 'seeds', '001_test_user.sql');
    const seedSQL = await fs.readFile(seedPath, 'utf8');
    
    await pool.query(seedSQL);
    
    console.log('Test user initialized successfully!');
    console.log('Test credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');
  } catch (error) {
    console.error('Error initializing test user:', error);
  } finally {
    await pool.end();
  }
}

initTestUser();
