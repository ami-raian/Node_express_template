import authService from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';
import ResponseHelper from '../helpers/response.helper.js';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  ResponseHelper.success(
    res,
    { user, token },
    'User registered successfully',
    201
  );
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  ResponseHelper.success(res, { user, token }, 'Login successful');
});

/**
 * Get current authenticated user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  ResponseHelper.success(res, { user }, 'User retrieved successfully');
});

/**
 * Update current user's password
 * @route PUT /api/v1/auth/update-password
 * @access Private
 */
export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { user, token } = await authService.updatePassword(
    req.user._id,
    currentPassword,
    newPassword
  );

  ResponseHelper.success(res, { user, token }, 'Password updated successfully');
});

/**
 * Logout user (client-side token removal)
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = catchAsync(async (req, res) => {
  // JWT tokens are stateless, so logout is handled client-side by removing the token
  // This endpoint exists for consistency and can be extended with token blacklisting if needed
  ResponseHelper.success(res, null, 'Logout successful');
});
