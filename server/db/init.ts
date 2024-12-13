import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function initDb() {
  try {
    // Read migration files
    const migrationsPath = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsPath).sort();

    // Execute each migration
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const migration = fs.readFileSync(
          path.join(migrationsPath, file),
          'utf-8'
        );
        await pool.query(migration);
        console.log(`Executed migration: ${file}`);
      }
    }

    // Create test user if in development
    if (process.env.NODE_ENV === 'development') {
      const testEmail = process.env.TEST_USER_EMAIL;
      const testPassword = process.env.TEST_USER_PASSWORD;

      if (testEmail && testPassword) {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        await pool.query(
          `
          INSERT INTO users (email, password, name)
          VALUES ($1, $2, $3)
          ON CONFLICT (email) DO NOTHING
          `,
          [testEmail, hashedPassword, 'Test User']
        );
        console.log('Test user created or already exists');
      }
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDb();