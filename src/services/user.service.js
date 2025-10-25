import userRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';

class UserService {
  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  /**
   * Get all users with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  async getAllUsers(options) {
    const users = await userRepository.findAll(options);
    const total = await userRepository.count();

    return {
      users,
      pagination: {
        total,
        page: options.page || 1,
        limit: options.limit || 10,
        pages: Math.ceil(total / (options.limit || 10)),
      },
    };
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const user = await userRepository.create(userData);
    return user;
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  async updateUser(id, updateData) {
    // Don't allow password update through this method
    if (updateData.password) {
      delete updateData.password;
    }

    const user = await userRepository.update(id, updateData);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    const user = await userRepository.delete(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
  }

  /**
   * Authenticate user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  async authenticateUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }
}

export default new UserService();
