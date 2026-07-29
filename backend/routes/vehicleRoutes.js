import express from 'express';
import { supabase } from '../db/supabase.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Fallback in-memory vehicles store if Supabase credentials are not connected yet
let memoryVehicles = [
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
  },
];

let memorySalesTransactions = [];

/**
 * @route   GET /api/vehicles/search
 * @desc    Search & filter vehicle inventory (Query params: q, make, category, minPrice, maxPrice)
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { q, make, category, minPrice, maxPrice } = req.query;

    if (supabase) {
      let query = supabase.from('vehicles').select('*');

      if (make && make !== 'All') {
        query = query.ilike('make', `%${make}%`);
      }
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      let { data: vehicles, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ message: `Search query error: ${error.message}` });
      }

      if (q) {
        const searchTerm = q.toLowerCase();
        vehicles = vehicles.filter(
          (v) =>
            v.make.toLowerCase().includes(searchTerm) ||
            v.model.toLowerCase().includes(searchTerm) ||
            v.category.toLowerCase().includes(searchTerm) ||
            (v.description && v.description.toLowerCase().includes(searchTerm))
        );
      }

      return res.json(vehicles);
    }

    // Fallback Memory Search
    let results = [...memoryVehicles];

    if (make && make !== 'All') {
      results = results.filter((v) => v.make.toLowerCase().includes(make.toLowerCase()));
    }
    if (category && category !== 'All') {
      results = results.filter((v) => v.category.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
      results = results.filter((v) => v.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter((v) => v.price <= parseFloat(maxPrice));
    }
    if (q) {
      const searchTerm = q.toLowerCase();
      results = results.filter(
        (v) =>
          v.make.toLowerCase().includes(searchTerm) ||
          v.model.toLowerCase().includes(searchTerm) ||
          v.category.toLowerCase().includes(searchTerm) ||
          (v.description && v.description.toLowerCase().includes(searchTerm))
      );
    }

    return res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Server error during inventory search' });
  }
});

/**
 * @route   GET /api/vehicles
 * @desc    Get all vehicles in inventory
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    if (supabase) {
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.json(vehicles);
    }

    return res.json(memoryVehicles);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching inventory' });
  }
});

/**
 * @route   GET /api/vehicles/transactions/all
 * @desc    Get all sales audit transactions (Admin only)
 * @access  Private (Admin)
 */
router.get('/transactions/all', protect, adminOnly, async (req, res) => {
  try {
    if (supabase) {
      const { data: transactions, error } = await supabase
        .from('sales_transactions')
        .select('*, users(name, email), vehicles(make, model, year)')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.json(transactions);
    }

    return res.json(memorySalesTransactions);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching transaction audit ledger' });
  }
});

/**
 * @route   GET /api/vehicles/:id
 * @desc    Get vehicle by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      return res.json(vehicle);
    }

    const vehicle = memoryVehicles.find((v) => v.id === id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching vehicle details' });
  }
});

/**
 * @route   POST /api/vehicles
 * @desc    Create a new vehicle (Admin only)
 * @access  Private (Admin)
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { make, model, year, price, stock, category, image_url, description } = req.body;

    if (!make || !model || !year || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Make, model, year, price, stock, and category are required' });
    }

    const newVehicle = {
      make,
      model,
      year: parseInt(year),
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      image_url: image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      description: description || '',
    };

    if (supabase) {
      const { data: createdVehicle, error } = await supabase
        .from('vehicles')
        .insert([newVehicle])
        .select('*')
        .single();

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(201).json(createdVehicle);
    }

    const created = {
      ...newVehicle,
      id: `v-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    memoryVehicles.unshift(created);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Server error creating vehicle' });
  }
});

/**
 * @route   PUT /api/vehicles/:id
 * @desc    Update an existing vehicle (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data: updatedVehicle, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.json(updatedVehicle);
    }

    const idx = memoryVehicles.findIndex((v) => v.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    memoryVehicles[idx] = { ...memoryVehicles[idx], ...updates };
    return res.json(memoryVehicles[idx]);
  } catch (err) {
    return res.status(500).json({ message: 'Server error updating vehicle' });
  }
});

/**
 * @route   DELETE /api/vehicles/:id
 * @desc    Delete a vehicle from catalog (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.json({ message: 'Vehicle deleted successfully' });
    }

    memoryVehicles = memoryVehicles.filter((v) => v.id !== id);
    return res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error deleting vehicle' });
  }
});

/**
 * @route   POST /api/vehicles/:id/purchase
 * @desc    Purchase vehicle / Decrement stock & record financial transaction
 * @access  Private (Customer or Admin)
 */
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = parseInt(req.body.quantity || 1);

    if (supabase) {
      // 1. Fetch current vehicle
      const { data: vehicle, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      if (vehicle.stock < quantity) {
        return res.status(400).json({ message: `Insufficient inventory stock. Only ${vehicle.stock} available.` });
      }

      const newStock = vehicle.stock - quantity;
      const totalPrice = vehicle.price * quantity;

      // 2. Decrement stock
      const { data: updatedVehicle, error: updateError } = await supabase
        .from('vehicles')
        .update({ stock: newStock })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        return res.status(500).json({ message: `Failed to update inventory: ${updateError.message}` });
      }

      // 3. Record transaction in sales_transactions audit table
      const { data: transaction, error: transError } = await supabase
        .from('sales_transactions')
        .insert([
          {
            user_id: req.user.id,
            vehicle_id: id,
            quantity,
            total_price: totalPrice,
            payment_status: 'completed',
          },
        ])
        .select('*')
        .single();

      return res.json({
        message: 'Vehicle purchased successfully!',
        vehicle: updatedVehicle,
        transaction,
      });
    }

    // Fallback Memory Logic
    const vehicle = memoryVehicles.find((v) => v.id === id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.stock < quantity) {
      return res.status(400).json({ message: `Insufficient inventory stock. Only ${vehicle.stock} available.` });
    }

    vehicle.stock -= quantity;
    const totalPrice = vehicle.price * quantity;
    const transaction = {
      id: `tx-${Date.now()}`,
      user_id: req.user.id,
      user_name: req.user.name,
      user_email: req.user.email,
      vehicle_id: id,
      vehicle_name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      quantity,
      total_price: totalPrice,
      payment_status: 'completed',
      created_at: new Date().toISOString(),
    };
    memorySalesTransactions.unshift(transaction);

    return res.json({
      message: 'Vehicle purchased successfully!',
      vehicle,
      transaction,
    });
  } catch (err) {
    console.error('Purchase error:', err);
    return res.status(500).json({ message: 'Server error during vehicle purchase transaction' });
  }
});

/**
 * @route   POST /api/vehicles/:id/restock
 * @desc    Restock vehicle inventory count (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/restock', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const amount = parseInt(req.body.amount || 10);

    if (amount <= 0) {
      return res.status(400).json({ message: 'Restock amount must be greater than zero' });
    }

    if (supabase) {
      const { data: vehicle, error: fetchErr } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      const newStock = vehicle.stock + amount;
      const { data: updatedVehicle, error: updateErr } = await supabase
        .from('vehicles')
        .update({ stock: newStock })
        .eq('id', id)
        .select('*')
        .single();

      if (updateErr) {
        return res.status(500).json({ message: updateErr.message });
      }

      return res.json({ message: `Successfully restocked ${amount} units`, vehicle: updatedVehicle });
    }

    const vehicle = memoryVehicles.find((v) => v.id === id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.stock += amount;
    return res.json({ message: `Successfully restocked ${amount} units`, vehicle });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during inventory restock' });
  }
});

export default router;
