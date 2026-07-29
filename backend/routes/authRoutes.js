import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db/supabase.js';
import { generateToken } from '../utils/jwt.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Fallback in-memory user store if Supabase credentials are not connected yet
const memoryUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Admin Manager',
    email: 'admin@dealership.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'John Doe',
    email: 'user@dealership.com',
    password_hash: bcrypt.hashSync('user123', 10),
    role: 'user',
  },
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = role === 'admin' ? 'admin' : 'user';

    // 1. If Supabase is connected
    if (supabase) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ name, email: cleanEmail, password_hash, role: userRole }])
        .select('id, name, email, role, created_at')
        .single();

      if (error) {
        return res.status(500).json({ message: `Registration error: ${error.message}` });
      }

      const token = generateToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });

      return res.status(201).json({
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        token,
      });
    }

    // 2. Fallback memory store logic
    const existingMemoryUser = memoryUsers.find((u) => u.email === cleanEmail);
    if (existingMemoryUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      password_hash,
      role: userRole,
    };
    memoryUsers.push(newUser);

    const token = generateToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });

    return res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If Supabase is connected
    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });

      return res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    }

    // 2. Fallback memory store logic
    const user = memoryUsers.find((u) => u.email === cleanEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user profile
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

export default router;
