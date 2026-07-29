import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

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
  res.status(404).json({ message: 'API Route Not Found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚗 Motor Matrix Express Server running on http://localhost:${PORT}`);
  console.log(`🔑 Auth Endpoints active at http://localhost:${PORT}/api/auth`);
  console.log(`🏎️  Vehicle Inventory Endpoints active at http://localhost:${PORT}/api/vehicles`);
});

