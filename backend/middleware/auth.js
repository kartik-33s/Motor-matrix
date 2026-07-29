import { verifyToken } from '../utils/jwt.js';

/**
 * Protect routes: Requires valid JWT in Authorization header
 */
export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }

  req.user = decoded;
  next();
};

/**
 * Admin authorization: Requires user role to be 'admin'
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};
