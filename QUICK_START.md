# Quick Start Guide

## Project Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-super-secret-key
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## Testing the API

### Health Check
```bash
curl http://localhost:5000/api/v1/health
```

### Create a User
```bash
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Users
```bash
curl http://localhost:5000/api/v1/users
```

### Get User by ID
```bash
curl http://localhost:5000/api/v1/users/{userId}
```

## Project Architecture

```
Request → Routes → Controller → Service → Repository → Database
                                    ↓
                                  Model
```

### Flow Example (Create User):
1. **Route** (`user.routes.js`) - Defines POST /users endpoint
2. **Validation** (`validate.js`) - Validates request body
3. **Controller** (`user.controller.js`) - Handles HTTP request
4. **Service** (`user.service.js`) - Business logic (check if user exists)
5. **Repository** (`user.repository.js`) - Database operations
6. **Model** (`user.model.js`) - Mongoose schema & validation

## ES6 Module Syntax

This project uses ES6 modules. Remember:

### ✅ Correct
```javascript
import User from './models/user.model.js';
import { env } from './config/index.js';
export default UserService;
```

### ❌ Incorrect
```javascript
const User = require('./models/user.model');
const { env } = require('./config');
module.exports = UserService;
```

## Adding a New Feature

Example: Adding Products

### Step 1: Create Model
```javascript
// src/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
```

### Step 2: Create Repository
```javascript
// src/repositories/product.repository.js
import Product from '../models/product.model.js';

class ProductRepository {
  async findAll() {
    return await Product.find();
  }

  async create(data) {
    return await Product.create(data);
  }

  async findById(id) {
    return await Product.findById(id);
  }
}

export default new ProductRepository();
```

### Step 3: Create Service
```javascript
// src/services/product.service.js
import productRepository from '../repositories/product.repository.js';
import AppError from '../utils/appError.js';

class ProductService {
  async getAllProducts() {
    return await productRepository.findAll();
  }

  async createProduct(data) {
    return await productRepository.create(data);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }
}

export default new ProductService();
```

### Step 4: Create Controller
```javascript
// src/controllers/product.controller.js
import productService from '../services/product.service.js';
import catchAsync from '../utils/catchAsync.js';

class ProductController {
  getAllProducts = catchAsync(async (req, res) => {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  });

  createProduct = catchAsync(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  });

  getProductById = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  });
}

export default new ProductController();
```

### Step 5: Create Routes
```javascript
// src/routes/product.routes.js
import express from 'express';
import productController from '../controllers/product.controller.js';

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProductById);

export default router;
```

### Step 6: Register Routes
```javascript
// src/routes/index.js
import productRoutes from './product.routes.js';

// Add this line
router.use('/products', productRoutes);
```

## Available NPM Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (nodemon)
npm test           # Run tests with coverage
npm run test:watch # Run tests in watch mode
npm run format     # Format code with Prettier
```

## Common Issues

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use
Change the PORT in `.env` file or kill the process:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

## Next Steps

1. Read [README.md](README.md) for detailed documentation
2. Check [ES6_MODULES_GUIDE.md](ES6_MODULES_GUIDE.md) for ES6 modules guide
3. Explore the example User CRUD implementation
4. Add your own features following the architecture pattern
5. Configure authentication/authorization as needed
6. Set up your preferred database (MongoDB, PostgreSQL, etc.)

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Joi Validation](https://joi.dev/)
- [Node.js ES Modules](https://nodejs.org/api/esm.html)
