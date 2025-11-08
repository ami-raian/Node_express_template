import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyToken } from '../utils/jwt.js';
import userRepository from '../repositories/user.repository.js';

/**
 * Middleware to protect routes - requires valid JWT token
 * Attaches user object to req.user
 */
export const requireAuth = catchAsync(async (req, res, next) => {
  // 1. Get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    return next(new AppError(error.message, 401));
  }

  // 3. Check if user still exists
  const user = await userRepository.findById(decoded.id);
  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4. Check if user is active
  if (!user.isActive) {
    return next(
      new AppError(
        'Your account has been deactivated. Please contact support.',
        401
      )
    );
  }

  // 5. Grant access to protected route
  req.user = user;
  next();
});

/**
 * Middleware to restrict access to specific roles
 * Must be used after requireAuth middleware
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'moderator')
 * @returns {Function} Express middleware function
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          'User not authenticated. Use requireAuth middleware first.',
          500
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};

/**
 * Optional auth middleware - attaches user if token is valid, but doesn't require it
 * Useful for endpoints that change behavior based on authentication status
 */
export const optionalAuth = catchAsync(async (req, res, next) => {
  // 1. Get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, just continue without attaching user
  if (!token) {
    return next();
  }

  // 2. Try to verify token
  try {
    const decoded = verifyToken(token);

    // 3. Check if user exists and is active
    const user = await userRepository.findById(decoded.id);
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Token is invalid, but we don't care - just continue without user
  }

  next();
});
