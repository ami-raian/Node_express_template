const Joi = require('joi');

const userValidation = {
  createUser: {
    body: Joi.object({
      name: Joi.string().required().min(2).max(50),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      role: Joi.string().valid('user', 'admin', 'moderator'),
    }),
  },

  updateUser: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().min(2).max(50),
      email: Joi.string().email(),
      role: Joi.string().valid('user', 'admin', 'moderator'),
      isActive: Joi.boolean(),
    }),
  },

  getUser: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  deleteUser: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};

module.exports = { userValidation };
