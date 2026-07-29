import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/sqlite.js';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import { globalLimiter } from './middleware/rateLimiter.js';

dotenv.config();
initDb();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (e.g. Nginx, Heroku, Cloudflare)
app.set('trust proxy', 1);

// Global Middleware
app.use(cors());
app.use(express.json());

// Mount Global Rate Limiter on /api endpoints
app.use('/api', globalLimiter);

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/orders', orderRoutes);

// Root & API Info Endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    name: 'Motor Matrix API Server',
    version: '1.0.0',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      orders: '/api/orders',
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'Motor Matrix Base API Endpoint',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      orders: '/api/orders',
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Motor Matrix Car Dealership API Server Running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `API Route Not Found: ${req.method} ${req.originalUrl}` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚗 Motor Matrix Express Server running on http://localhost:${PORT}`);
  console.log(`🔑 Auth Endpoints active at http://localhost:${PORT}/api/auth`);
  console.log(`🏎️  Vehicle Inventory Endpoints active at http://localhost:${PORT}/api/vehicles`);
  console.log(`📦 Order & Analytics Endpoints active at http://localhost:${PORT}/api/orders`);
});

