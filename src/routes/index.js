const express = require('express');
const userRoutes = require('./user.routes');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/users', userRoutes);

// Add more routes here
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

module.exports = router;
