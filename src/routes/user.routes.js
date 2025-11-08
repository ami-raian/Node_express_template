import express from 'express';
import userController from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import { userValidation } from '../validators/user.validator.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (moved to auth routes: register)
// All user routes now require authentication

router
  .route('/')
  .get(
    requireAuth,
    requireRole('admin', 'moderator'),
    userController.getAllUsers
  )
  .post(
    requireAuth,
    requireRole('admin'),
    validate(userValidation.createUser),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    requireAuth,
    validate(userValidation.getUser),
    userController.getUserById
  )
  .put(
    requireAuth,
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    requireAuth,
    requireRole('admin'),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
