import bcrypt from 'bcryptjs';
import { supabase } from './db/supabase.js';

const demoUsers = [
  {
    name: 'Admin Manager',
    email: 'admin@dealership.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'user@dealership.com',
    password: 'user123',
    role: 'user',
  },
];

const demoVehicles = [
  {
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
  console.log('🚀 Starting Supabase Database Seed...');

  if (!supabase) {
    console.error('❌ Cannot seed database: Supabase credentials missing in .env file.');
    console.log('\n💡 Please add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env file, then run SQL in backend/db/schema.sql on Supabase.');
    process.exit(1);
  }

  try {
    // 1. Seed Users
    console.log('📦 Seeding Demo Users...');
    for (const u of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(u.password, salt);

      const { data, error } = await supabase
        .from('users')
        .upsert(
          { name: u.name, email: u.email, password_hash, role: u.role },
          { onConflict: 'email' }
        )
        .select();

      if (error) {
        console.error(`❌ Error seeding user ${u.email}:`, error.message);
      } else {
        console.log(`  ✓ Seeded user: ${u.email} (${u.role})`);
      }
    }

    // 2. Seed Vehicles
    console.log('\n🏎️  Seeding Vehicle Inventory...');
    for (const v of demoVehicles) {
      const { data, error } = await supabase
        .from('vehicles')
        .upsert(
          {
            make: v.make,
            model: v.model,
            year: v.year,
            price: v.price,
            stock: v.stock,
            category: v.category,
            image_url: v.image_url,
            description: v.description,
          },
          { onConflict: 'make,model,year' }
        )
        .select();

      if (error) {
        // Fallback simple insert if composite constraint doesn't exist
        const { error: insertErr } = await supabase.from('vehicles').insert(v);
        if (insertErr) {
          console.error(`❌ Error seeding vehicle ${v.make} ${v.model}:`, insertErr.message);
        } else {
          console.log(`  ✓ Seeded vehicle: ${v.year} ${v.make} ${v.model}`);
        }
      } else {
        console.log(`  ✓ Seeded vehicle: ${v.year} ${v.make} ${v.model}`);
      }
    }

    console.log('\n✅ Database seeding complete!');
  } catch (err) {
    console.error('❌ Unexpected error during database seed:', err);
    process.exit(1);
  }
}

seedDatabase();
