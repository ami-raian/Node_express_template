# Node.js Express REST API Template

A professional, production-ready Node.js Express REST API template with clean architecture following the Repository Pattern.

## Features

- **ES6 Modules**: Modern JavaScript with import/export syntax
- **Clean Architecture**: Separation of concerns with Controllers, Services, Repositories
- **Repository Pattern**: Database abstraction layer for better maintainability
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Request validation using Joi
- **Error Handling**: Centralized error handling
- **Logging**: Morgan HTTP request logger
- **Code Quality**: Prettier configuration for consistent formatting
- **Testing**: Jest setup ready
- **Environment Config**: Dotenv for environment variables

## Folder Structure

```
Node-express-template/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database connection
│   │   ├── env.js           # Environment variables
│   │   └── index.js         # Config barrel export
│   ├── constants/           # Application constants
│   │   └── index.js
│   ├── controllers/         # Request handlers
│   │   └── user.controller.js
│   ├── helpers/             # Helper functions
│   │   └── response.helper.js
│   ├── interfaces/          # TypeScript-like interfaces (JSDoc)
│   │   └── user.interface.js
│   ├── middlewares/         # Express middlewares
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── notFound.js
│   │   └── validate.js
│   ├── models/              # Database models (Mongoose schemas)
│   │   └── user.model.js
│   ├── repositories/        # Data access layer
│   │   └── user.repository.js
│   ├── routes/              # API routes
│   │   ├── index.js
│   │   └── user.routes.js
│   ├── services/            # Business logic
│   │   └── user.service.js
│   ├── utils/               # Utility functions
│   │   ├── appError.js
│   │   └── catchAsync.js
│   ├── validators/          # Request validation schemas
│   │   └── user.validator.js
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── tests/                   # Test files
│   ├── unit/
│   └── integration/
├── public/                  # Static files
│   └── uploads/
├── logs/                    # Log files
├── .env.example             # Example environment variables
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── .gitignore
├── package.json
└── README.md
```

## Architecture Layers

### 1. **Controllers**
- Handle HTTP requests and responses
- Validate input data
- Call appropriate services
- Return formatted responses

### 2. **Services**
- Contain business logic
- Orchestrate operations between repositories
- Handle data transformation
- Enforce business rules

### 3. **Repositories**
- Direct database access
- CRUD operations
- Data persistence layer
- Query abstraction

### 4. **Models**
- Database schema definitions
- Data validation rules
- Instance methods
- Virtual properties

### 5. **Routes**
- API endpoint definitions
- Route grouping
- Middleware attachment

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Node-express-template
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update `.env` with your configuration
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run format` - Format code with Prettier

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /api/v1/health
```

### Users
```
GET    /api/v1/users          # Get all users (paginated)
GET    /api/v1/users/:id      # Get user by ID
POST   /api/v1/users          # Create new user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

### Example Request
```bash
# Create a user
curl -X POST http://localhost:5000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## ES6 Modules

This project uses **ES6 Modules** (`import`/`export`) instead of CommonJS (`require`/`module.exports`).

### Key Points:
- All imports must include `.js` file extension
- Use `import` and `export` syntax
- See [ES6_MODULES_GUIDE.md](ES6_MODULES_GUIDE.md) for complete guide

### Example:
```javascript
// ✅ Correct ES6 import
import User from '../models/user.model.js';
import { env } from '../config/index.js';

// ❌ Wrong (missing .js extension)
import User from '../models/user.model';
```

## Adding New Features

### 1. Create Model
```javascript
// src/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
```

### 2. Create Repository
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
}

export default new ProductRepository();
```

### 3. Create Service
```javascript
// src/services/product.service.js
import productRepository from '../repositories/product.repository.js';

class ProductService {
  async getAllProducts() {
    return await productRepository.findAll();
  }

  async createProduct(data) {
    return await productRepository.create(data);
  }
}

export default new ProductService();
```

### 4. Create Controller
```javascript
// src/controllers/product.controller.js
import productService from '../services/product.service.js';
import catchAsync from '../utils/catchAsync.js';

class ProductController {
  getAllProducts = catchAsync(async (req, res) => {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  });
}

export default new ProductController();
```

### 5. Create Routes
```javascript
// src/routes/product.routes.js
import express from 'express';
import productController from '../controllers/product.controller.js';

const router = express.Router();
router.get('/', productController.getAllProducts);

export default router;
```

### 6. Register Routes
```javascript
// src/routes/index.js
import productRoutes from './product.routes.js';
router.use('/products', productRoutes);
```

## Best Practices

1. **Always use the Repository Pattern** - Keep database logic in repositories
2. **Business logic in Services** - Controllers should be thin
3. **Use catchAsync** - Wrap async controllers to handle errors
4. **Validate input** - Use Joi validators for all inputs
5. **Error handling** - Throw AppError for operational errors
6. **Constants** - Store magic strings/numbers in constants
7. **Documentation** - Add JSDoc comments to functions
8. **Testing** - Write tests for services and repositories

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/myapp |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 30d |
| API_VERSION | API version | v1 |
| CORS_ORIGIN | CORS allowed origins | * |
| RATE_LIMIT_WINDOW | Rate limit window (ms) | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Error Handling

The application uses a centralized error handling mechanism:

```javascript
// Throw operational errors
throw new AppError('User not found', 404);

// Errors are caught by catchAsync and sent to error handler
```

## Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Joi validation on all inputs
- **Password Hashing**: Bcrypt for password security

## License

ISC 
