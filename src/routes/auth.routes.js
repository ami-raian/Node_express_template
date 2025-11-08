import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
} from '../validators/auth.validator.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate({ body: registerSchema }),
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate({ body: loginSchema }), authController.login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', requireAuth, authController.getMe);

/**
 * @route   PUT /api/v1/auth/update-password
 * @desc    Update current user's password
 * @access  Private
 */
router.put(
  '/update-password',
  requireAuth,
  validate({ body: updatePasswordSchema }),
  authController.updatePassword
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', requireAuth, authController.logout);

export default router;
