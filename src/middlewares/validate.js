import Joi from 'joi';
import AppError from '../utils/appError.js';

const validate = (schema) => {
  return (req, res, next) => {
    const validSchema = {};

    ['params', 'query', 'body'].forEach((key) => {
      if (schema[key]) {
        validSchema[key] = req[key];
      }
    });

    const { error, value } = Joi.compile(schema).validate(validSchema, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ');
      return next(new AppError(errorMessage, 400));
    }

    Object.assign(req, value);
    return next();
  };
};

export { validate };
