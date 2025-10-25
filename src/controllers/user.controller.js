const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

class UserController {
  /**
   * Get all users
   * @route GET /api/v1/users
   */
  getAllUsers = catchAsync(async (req, res) => {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: req.query.sort || "-createdAt",
    };

    const result = await userService.getAllUsers(options);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  });

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  getUserById = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  /**
   * Create new user
   * @route POST /api/v1/users
   */
  createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  });

  /**
   * Update user
   * @route PUT /api/v1/users/:id
   */
  updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  /**
   * Delete user
   * @route DELETE /api/v1/users/:id
   */
  deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      data: null,
      message: "User deleted successfully",
    });
  });
}

module.exports = new UserController();
