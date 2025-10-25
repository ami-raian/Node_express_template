const morgan = require('morgan');
const { env } = require('../config');

const logger = () => {
  if (env.NODE_ENV === 'development') {
    return morgan('dev');
  }
  return morgan('combined');
};

module.exports = logger;
