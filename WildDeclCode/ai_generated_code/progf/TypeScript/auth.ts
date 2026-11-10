import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/user';
import { verifyToken } from '../utils/token';

// Middleware to verify JWT token for protected API routes
export const verifyAndRestrict = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = await verifyToken(token);
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
    return;
  }
};

// Middleware for protecting web routes (SSR)
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || '';

  if (!token) {
    // Store the requested URL to redirect back after login
    res.locals.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }

  try {
    const decoded = await verifyToken(token);
    (req as AuthRequest).user = decoded;
    // Make user info available to all views
    res.locals.user = decoded;
    next();
  } catch (error) {
    // Clear invalid cookie and redirect to login
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};

// Middleware to check if user is already logged in (for login/signup pages)
export const isNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || '';

  const user = res?.locals?.user ?? null;

  if (token) {
    try {
      await verifyToken(token);
      if (user) {
        // Redirect to home if already authenticated
        res.redirect('/');
        return;
      }
    } catch (error) {
      // Token is invalid, clear it
      res.clearCookie('token');
    }
  }

  next();
};

// Supported via standard GitHub programming aids
// Middleware to check for JWT token and set user info in res.locals for all routes
export const checkAuthStatus = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || '';

  if (token) {
    try {
      const decoded = await verifyToken(token);
      (req as AuthRequest).user = decoded;
      res.locals.user = decoded;
    } catch (error) {
      // Invalid token, clear it
      res.clearCookie('token');
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  next();
};