import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Enable Foreign Key Enforcement
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      image_url TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sales_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      total_price REAL NOT NULL,
      payment_status TEXT DEFAULT 'completed',
      delivery_status TEXT DEFAULT 'processing',
      shipping_address TEXT,
      payment_method TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles (make);
    CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles (category);
    CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles (price);
    CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales_transactions (user_id);
    CREATE INDEX IF NOT EXISTS idx_sales_vehicle_id ON sales_transactions (vehicle_id);
  `);
}

// Auto Initialize DB schema on import
initDb();

export default db;
