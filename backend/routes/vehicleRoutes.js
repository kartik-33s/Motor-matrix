import express from 'express';
import crypto from 'crypto';
import db from '../db/sqlite.js';
import { supabase } from '../db/supabase.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * Helper: Map row to vehicle object (ensure types match)
 */
const formatVehicle = (row) => {
  if (!row) return null;
  return {
    ...row,
    year: Number(row.year),
    price: Number(row.price),
    stock: Number(row.stock),
  };
};

/**
 * @route   GET /api/vehicles/search
 * @desc    Search & filter vehicle inventory (Query params: q, make, category, minPrice, maxPrice)
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { q, make, category, minPrice, maxPrice } = req.query;

    let sql = 'SELECT * FROM vehicles WHERE 1=1';
    const params = [];

    if (make && make !== 'All') {
      sql += ' AND LOWER(make) LIKE ?';
      params.push(`%${make.toLowerCase()}%`);
    }

    if (category && category !== 'All') {
      sql += ' AND LOWER(category) = ?';
      params.push(category.toLowerCase());
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    sql += ' ORDER BY created_at DESC';

    const rows = db.prepare(sql).all(...params);
    let vehicles = rows.map(formatVehicle);

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
    const rows = db.prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
    const vehicles = rows.map(formatVehicle);
    return res.json(vehicles);
  } catch (err) {
    console.error('Fetch inventory error:', err);
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
    const rows = db.prepare(`
      SELECT 
        st.*,
        u.name as user_name,
        u.email as user_email,
        v.make as v_make,
        v.model as v_model,
        v.year as v_year,
        v.category as v_category,
        v.image_url as v_image_url
      FROM sales_transactions st
      LEFT JOIN users u ON st.user_id = u.id
      LEFT JOIN vehicles v ON st.vehicle_id = v.id
      ORDER BY st.created_at DESC
    `).all();

    const transactions = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      vehicle_id: r.vehicle_id,
      quantity: Number(r.quantity),
      total_price: Number(r.total_price),
      payment_status: r.payment_status,
      delivery_status: r.delivery_status || 'processing',
      shipping_address: r.shipping_address || 'Primary Delivery Address',
      payment_method: r.payment_method || 'Verified Credit Card',
      created_at: r.created_at,
      users: {
        name: r.user_name || 'Customer',
        email: r.user_email || 'N/A',
      },
      vehicles: r.v_make ? {
        make: r.v_make,
        model: r.v_model,
        year: Number(r.v_year),
        category: r.v_category,
        image_url: r.v_image_url,
      } : null,
      user_name: r.user_name || 'Customer',
      user_email: r.user_email || 'N/A',
      vehicle_name: r.v_make ? `${r.v_year} ${r.v_make} ${r.v_model}` : 'Vehicle Order',
    }));

    return res.json(transactions);
  } catch (err) {
    console.error('Transactions ledger fetch error:', err);
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
    const row = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json(formatVehicle(row));
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

    const newId = `v-${crypto.randomUUID()}`;
    const defaultImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80';

    const stmt = db.prepare(`
      INSERT INTO vehicles (id, make, model, year, price, stock, category, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newId,
      make.trim(),
      model.trim(),
      parseInt(year),
      parseFloat(price),
      parseInt(stock),
      category.trim(),
      image_url ? image_url.trim() : defaultImage,
      description ? description.trim() : ''
    );

    const created = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(newId);
    return res.status(201).json(formatVehicle(created));
  } catch (err) {
    console.error('Create vehicle error:', err);
    return res.status(500).json({ message: err.message || 'Server error creating vehicle' });
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
    const existing = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const make = req.body.make !== undefined ? req.body.make : existing.make;
    const model = req.body.model !== undefined ? req.body.model : existing.model;
    const year = req.body.year !== undefined ? parseInt(req.body.year) : existing.year;
    const price = req.body.price !== undefined ? parseFloat(req.body.price) : existing.price;
    const stock = req.body.stock !== undefined ? parseInt(req.body.stock) : existing.stock;
    const category = req.body.category !== undefined ? req.body.category : existing.category;
    const image_url = req.body.image_url !== undefined ? req.body.image_url : existing.image_url;
    const description = req.body.description !== undefined ? req.body.description : existing.description;

    const stmt = db.prepare(`
      UPDATE vehicles
      SET make = ?, model = ?, year = ?, price = ?, stock = ?, category = ?, image_url = ?, description = ?
      WHERE id = ?
    `);

    stmt.run(make, model, year, price, stock, category, image_url, description, id);

    const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    return res.json(formatVehicle(updated));
  } catch (err) {
    console.error('Update vehicle error:', err);
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
    const existing = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete associated transactions if any, then delete vehicle
    db.prepare('DELETE FROM sales_transactions WHERE vehicle_id = ?').run(id);
    db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);

    return res.json({ message: 'Vehicle deleted successfully', id });
  } catch (err) {
    console.error('Delete vehicle error:', err);
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

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.stock < quantity) {
      return res.status(400).json({ message: `Insufficient inventory stock. Only ${vehicle.stock} available.` });
    }

    const newStock = vehicle.stock - quantity;
    const totalPrice = vehicle.price * quantity;
    const transactionId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;

    db.prepare('UPDATE vehicles SET stock = ? WHERE id = ?').run(newStock, id);

    db.prepare(`
      INSERT INTO sales_transactions (id, user_id, vehicle_id, quantity, total_price, payment_status, delivery_status, shipping_address, payment_method)
      VALUES (?, ?, ?, ?, ?, 'completed', 'processing', 'Primary Delivery Address', 'Verified Card Transaction')
    `).run(transactionId, req.user.id, id, quantity, totalPrice);

    const updatedVehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);

    return res.json({
      message: 'Vehicle purchased successfully!',
      vehicle: formatVehicle(updatedVehicle),
      transaction: {
        id: transactionId,
        user_id: req.user.id,
        vehicle_id: id,
        quantity,
        total_price: totalPrice,
        payment_status: 'completed',
      },
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

    const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const newStock = vehicle.stock + amount;
    db.prepare('UPDATE vehicles SET stock = ? WHERE id = ?').run(newStock, id);

    const updated = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
    return res.json({ message: `Successfully restocked ${amount} units`, vehicle: formatVehicle(updated) });
  } catch (err) {
    console.error('Restock error:', err);
    return res.status(500).json({ message: 'Server error during inventory restock' });
  }
});

export default router;
