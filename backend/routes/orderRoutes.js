import express from 'express';
import db from '../db/sqlite.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to calculate analytics object from transactions list
const computeAnalytics = (orders) => {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => {
    return o.payment_status !== 'cancelled' ? sum + Number(o.total_price || 0) : sum;
  }, 0);

  const completedOrders = orders.filter((o) => o.payment_status === 'completed').length;
  const pendingOrders = orders.filter((o) => o.payment_status === 'pending').length;
  const cancelledOrders = orders.filter((o) => o.payment_status === 'cancelled').length;

  // Category breakdown
  const categoryMap = {};
  const makeMap = {};

  orders.forEach((o) => {
    const cat = o.vehicle?.category || 'Uncategorized';
    const make = o.vehicle?.make || 'Unknown';
    const price = Number(o.total_price || 0);

    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, totalSpent: 0 };
    categoryMap[cat].count += 1;
    categoryMap[cat].totalSpent += price;

    if (!makeMap[make]) makeMap[make] = { count: 0, totalSpent: 0 };
    makeMap[make].count += 1;
    makeMap[make].totalSpent += price;
  });

  const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    count: categoryMap[cat].count,
    totalSpent: categoryMap[cat].totalSpent,
    percentage: totalOrders > 0 ? Math.round((categoryMap[cat].count / totalOrders) * 100) : 0,
  }));

  const brandBreakdown = Object.keys(makeMap).map((make) => ({
    make,
    count: makeMap[make].count,
    totalSpent: makeMap[make].totalSpent,
  }));

  // Determine Favorite Make
  let favoriteMake = 'N/A';
  let maxMakeCount = 0;
  Object.keys(makeMap).forEach((make) => {
    if (makeMap[make].count > maxMakeCount) {
      maxMakeCount = makeMap[make].count;
      favoriteMake = make;
    }
  });

  // Recent timeline
  const recentTimeline = orders.slice(0, 10).map((o) => ({
    id: o.id,
    date: o.created_at,
    vehicleName: o.vehicle ? `${o.vehicle.year} ${o.vehicle.make} ${o.vehicle.model}` : 'Vehicle Order',
    amount: o.total_price,
    status: o.payment_status,
    category: o.vehicle?.category || 'General',
  }));

  return {
    totalOrders,
    totalSpent,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    favoriteMake,
    categoryBreakdown,
    brandBreakdown,
    recentTimeline,
  };
};

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get logged in user's vehicle purchase order history
 * @access  Private
 */
router.get('/my-orders', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category, search } = req.query;

    const rows = db.prepare(`
      SELECT 
        st.*,
        v.make as v_make,
        v.model as v_model,
        v.year as v_year,
        v.price as v_price,
        v.stock as v_stock,
        v.category as v_category,
        v.image_url as v_image_url,
        v.description as v_description
      FROM sales_transactions st
      LEFT JOIN vehicles v ON st.vehicle_id = v.id
      WHERE st.user_id = ?
      ORDER BY st.created_at DESC
    `).all(userId);

    let orders = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      vehicle_id: r.vehicle_id,
      quantity: Number(r.quantity),
      total_price: Number(r.total_price),
      payment_status: r.payment_status || 'completed',
      delivery_status: r.delivery_status || 'processing',
      shipping_address: r.shipping_address || 'Primary Delivery Address',
      payment_method: r.payment_method || 'Verified Card Transaction',
      created_at: r.created_at,
      vehicle: r.v_make ? {
        id: r.vehicle_id,
        make: r.v_make,
        model: r.v_model,
        year: Number(r.v_year),
        price: Number(r.v_price),
        stock: Number(r.v_stock),
        category: r.v_category,
        image_url: r.v_image_url,
        description: r.v_description,
      } : null,
    }));

    // Apply filters
    if (status && status !== 'all') {
      orders = orders.filter((o) => o.payment_status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'all') {
      orders = orders.filter(
        (o) => o.vehicle && o.vehicle.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const term = search.toLowerCase();
      orders = orders.filter((o) => {
        const make = o.vehicle?.make?.toLowerCase() || '';
        const model = o.vehicle?.model?.toLowerCase() || '';
        const id = o.id.toLowerCase();
        return make.includes(term) || model.includes(term) || id.includes(term);
      });
    }

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error('Fetch my-orders error:', err);
    return res.status(500).json({ message: 'Server error retrieving order history' });
  }
});

/**
 * @route   GET /api/orders/analytics
 * @desc    Get order statistics and analytics for logged-in user
 * @access  Private
 */
router.get('/analytics', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const rows = db.prepare(`
      SELECT 
        st.*,
        v.make as v_make,
        v.model as v_model,
        v.year as v_year,
        v.category as v_category
      FROM sales_transactions st
      LEFT JOIN vehicles v ON st.vehicle_id = v.id
      WHERE st.user_id = ?
      ORDER BY st.created_at DESC
    `).all(userId);

    const orders = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      vehicle_id: r.vehicle_id,
      quantity: Number(r.quantity),
      total_price: Number(r.total_price),
      payment_status: r.payment_status,
      created_at: r.created_at,
      vehicle: r.v_make ? {
        make: r.v_make,
        model: r.v_model,
        year: Number(r.v_year),
        category: r.v_category,
      } : null,
    }));

    const analytics = computeAnalytics(orders);

    return res.json({
      success: true,
      analytics,
    });
  } catch (err) {
    console.error('Fetch analytics error:', err);
    return res.status(500).json({ message: 'Server error calculating order analytics' });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order transaction details & receipt itemization
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const row = db.prepare(`
      SELECT 
        st.*,
        u.name as user_name,
        u.email as user_email,
        v.make as v_make,
        v.model as v_model,
        v.year as v_year,
        v.price as v_price,
        v.category as v_category,
        v.image_url as v_image_url
      FROM sales_transactions st
      LEFT JOIN users u ON st.user_id = u.id
      LEFT JOIN vehicles v ON st.vehicle_id = v.id
      WHERE st.id = ?
    `).get(id);

    if (!row) {
      return res.status(404).json({ message: 'Order transaction record not found' });
    }

    // Ensure authorization
    if (row.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to transaction receipt' });
    }

    const basePrice = Number(row.total_price || 0);
    const quantity = Number(row.quantity || 1);
    const itemUnitPrice = basePrice / quantity;
    const destinationCharge = 1250.00;
    const taxRate = 0.07;
    const estimatedTax = basePrice * taxRate;
    const grandTotal = basePrice + destinationCharge + estimatedTax;

    const receipt = {
      orderId: row.id,
      date: row.created_at,
      paymentStatus: row.payment_status || 'completed',
      deliveryStatus: row.delivery_status || 'processing',
      customer: {
        name: row.user_name || req.user.name || 'Customer',
        email: row.user_email || req.user.email || 'customer@motormatrix.com',
      },
      vehicle: row.v_make ? {
        make: row.v_make,
        model: row.v_model,
        year: Number(row.v_year),
        price: Number(row.v_price || itemUnitPrice),
        category: row.v_category,
        image_url: row.v_image_url,
      } : {
        make: 'Motor Matrix',
        model: 'Performance Series',
        year: 2024,
        price: basePrice,
        category: 'Luxury',
      },
      pricing: {
        quantity,
        unitPrice: itemUnitPrice,
        subtotal: basePrice,
        destinationCharge,
        estimatedTax,
        grandTotal,
      },
      shippingAddress: row.shipping_address || '100 Matrix Parkway, Luxury Hub, CA',
      paymentMethod: row.payment_method || 'Verified Credit / Bank Wire',
    };

    return res.json({
      success: true,
      receipt,
    });
  } catch (err) {
    console.error('Fetch order receipt error:', err);
    return res.status(500).json({ message: 'Server error retrieving transaction receipt' });
  }
});

export default router;
