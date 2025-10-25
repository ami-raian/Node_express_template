require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/myapp",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",

  // API Configuration
  API_VERSION: process.env.API_VERSION || "v1",

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // Rate Limiting
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
};
