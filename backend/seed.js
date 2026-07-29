import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db, initDb } from './db/sqlite.js';
import { supabase } from './db/supabase.js';

const demoUsers = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    name: 'Admin Manager',
    email: 'admin@dealership.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'u2222222-2222-2222-2222-222222222222',
    name: 'John Doe',
    email: 'user@dealership.com',
    password: 'user123',
    role: 'user',
  },
];

const demoVehicles = [
  {
    id: 'v1111111-1111-1111-1111-111111111111',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    price: 89990.00,
    stock: 5,
    category: 'Electric',
    image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
    description: 'Tri-motor all-wheel drive with sub-2 second 0-60 mph acceleration and luxury minimalist interior.',
  },
  {
    id: 'v2222222-2222-2222-2222-222222222222',
    make: 'Porsche',
    model: '911 GT3',
    year: 2024,
    price: 182900.00,
    stock: 2,
    category: 'Sports',
    image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
    description: 'Naturally aspirated 4.0L flat-six engine delivering 502 horsepower of pure track performance.',
  },
  {
    id: 'v3333333-3333-3333-3333-333333333333',
    make: 'BMW',
    model: 'M5 Competition',
    year: 2023,
    price: 110900.00,
    stock: 4,
    category: 'Sedan',
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
    description: 'Twin-turbo V8 producing 617 hp, paired with M xDrive intelligent all-wheel drive system.',
  },
  {
    id: 'v4444444-4444-4444-4444-444444444444',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2024,
    price: 179000.00,
    stock: 3,
    category: 'SUV',
    image_url: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1000&q=80',
    description: 'Iconic off-road luxury vehicle powered by a handcrafted AMG 4.0L biturbo V8 engine.',
  },
  {
    id: 'v5555555-5555-5555-5555-555555555555',
    make: 'Ford',
    model: 'F-150 Lightning',
    year: 2024,
    price: 67990.00,
    stock: 8,
    category: 'Truck',
    image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
    description: 'All-electric pickup truck featuring Pro Power Onboard generator and massive front trunk capability.',
  },
  {
    id: 'v6666666-6666-6666-6666-666666666666',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    price: 147100.00,
    stock: 3,
    category: 'Electric',
    image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
    description: 'Electrifying performance grand tourer with dual synchronous motors and 800V charging system.',
  },
  {
    id: 'v7777777-7777-7777-7777-777777777777',
    make: 'Toyota',
    model: 'GR Supra 3.0',
    year: 2023,
    price: 54500.00,
    stock: 6,
    category: 'Sports',
    image_url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
    description: '3.0L turbocharged inline-six engine paired with 6-speed manual transmission for maximum driver engagement.',
  },
  {
    id: 'v8888888-8888-8888-8888-888888888888',
    make: 'Range Rover',
    model: 'Autobiography',
    year: 2024,
    price: 157600.00,
    stock: 2,
    category: 'SUV',
    image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    description: 'Peerless luxury flagship SUV offering executive rear seating and active noise cancellation.',
  },
  {
    id: 'v9999999-9999-9999-9999-999999999999',
    make: 'Lucid',
    model: 'Air Grand Touring',
    year: 2024,
    price: 109900.00,
    stock: 1,
    category: 'Electric',
    image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
    description: 'Ultra-efficient luxury EV with over 500 miles of estimated EPA range and 819 horsepower.',
  },
  {
    id: 'v0000000-0000-0000-0000-000000000000',
    make: 'Chevrolet',
    model: 'Corvette Z06',
    year: 2024,
    price: 112700.00,
    stock: 0,
    category: 'Sports',
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    description: 'Mid-engine supercar featuring a flat-plane crank 5.5L LT6 V8 revving up to 8,600 RPM.',
  },
];

async function seedDatabase() {
  console.log('🚀 Starting SQLite Database Seed...');
  initDb();

  try {
    // 1. Seed Users into SQLite
    console.log('📦 Seeding Demo Users...');
    const userStmt = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name=excluded.name,
        password_hash=excluded.password_hash,
        role=excluded.role
    `);

    for (const u of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(u.password, salt);
      userStmt.run(u.id, u.name, u.email.toLowerCase().trim(), password_hash, u.role);
      console.log(`  ✓ Seeded SQLite user: ${u.email} (${u.role})`);
    }

    // 2. Seed Vehicles into SQLite
    console.log('\n🏎️  Seeding Vehicle Inventory...');
    const vehicleStmt = db.prepare(`
      INSERT INTO vehicles (id, make, model, year, price, stock, category, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        make=excluded.make,
        model=excluded.model,
        year=excluded.year,
        price=excluded.price,
        stock=excluded.stock,
        category=excluded.category,
        image_url=excluded.image_url,
        description=excluded.description
    `);

    for (const v of demoVehicles) {
      vehicleStmt.run(
        v.id,
        v.make,
        v.model,
        v.year,
        v.price,
        v.stock,
        v.category,
        v.image_url,
        v.description
      );
      console.log(`  ✓ Seeded SQLite vehicle: ${v.year} ${v.make} ${v.model}`);
    }

    // Attempt Supabase seed if connected (optional)
    if (supabase) {
      try {
        console.log('\n☁️  Attempting Supabase sync...');
        for (const u of demoUsers) {
          const salt = await bcrypt.genSalt(10);
          const password_hash = await bcrypt.hash(u.password, salt);
          await supabase.from('users').upsert({ name: u.name, email: u.email, password_hash, role: u.role }, { onConflict: 'email' });
        }
      } catch (sbErr) {
        console.log('ℹ️  Supabase sync skipped (using local SQLite database).');
      }
    }

    console.log('\n✅ Database seeding complete!');
  } catch (err) {
    console.error('❌ Unexpected error during database seed:', err);
    process.exit(1);
  }
}

seedDatabase();
