const express = require('express');
const userController = require('../controllers/user.controller');
const { validate } = require('../middlewares/validate');
const { userValidation } = require('../validators/user.validator');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(validate(userValidation.createUser), userController.createUser);

router
  .route('/:id')
  .get(validate(userValidation.getUser), userController.getUserById)
  .put(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
