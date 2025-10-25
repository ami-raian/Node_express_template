import User from '../models/user.model.js';

class UserRepository {
  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  /**
   * Find all users with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findAll(options = {}) {
    const { page = 1, limit = 10, sort = "-createdAt" } = options;
    const skip = (page - 1) * limit;

    return await User.find().sort(sort).skip(skip).limit(limit);
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Update user by ID
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>}
   */
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>}
   */
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  /**
   * Count total users
   * @returns {Promise<number>}
   */
  async count() {
    return await User.countDocuments();
  }
}

export default new UserRepository();
