import morgan from 'morgan';
import { env } from '../config/index.js';

const logger = () => {
  if (env.NODE_ENV === 'development') {
    return morgan('dev');
  }
  return morgan('combined');
};

export default logger;
