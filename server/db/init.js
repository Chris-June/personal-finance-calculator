import pkg from 'pg';
const { Pool } = pkg;
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  user: process.env.POSTGRES_USER || os.userInfo().username,
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'fincalc',
  password: process.env.POSTGRES_PASSWORD || '',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Read and execute migration files in order
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = (await fs.readdir(migrationsDir)).sort();

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migration = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await pool.query(migration);
    }

    // Read and execute seed files
    const seedsDir = path.join(__dirname, 'seeds');
    const seedFiles = (await fs.readdir(seedsDir)).sort();

    for (const file of seedFiles) {
      console.log(`Running seed: ${file}`);
      const seed = await fs.readFile(path.join(seedsDir, file), 'utf8');
      await pool.query(seed);
    }

    console.log('Database initialization completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();