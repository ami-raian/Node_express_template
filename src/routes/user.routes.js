import express from 'express';
import userController from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import { userValidation } from '../validators/user.validator.js';

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

export default router;
