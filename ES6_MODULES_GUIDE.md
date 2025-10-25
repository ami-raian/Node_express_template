# ES6 Modules Guide

This project now uses **ES6 Modules** (import/export) instead of CommonJS (require/module.exports).

## Configuration

### package.json
```json
{
  "type": "module"
}
```

This tells Node.js to treat all `.js` files as ES6 modules.

## ES6 Import/Export Syntax

### Default Exports

**Exporting:**
```javascript
// userService.js
class UserService {
  // ...
}
export default new UserService();
```

**Importing:**
```javascript
// userController.js
import userService from './services/user.service.js';
```

### Named Exports

**Exporting:**
```javascript
// config/index.js
export { env, connectDB };

// OR
export const USER_ROLES = { ... };
export const HTTP_STATUS = { ... };
```

**Importing:**
```javascript
// Import specific named exports
import { env, connectDB } from './config/index.js';

// Import all as namespace
import * as config from './config/index.js';
// Usage: config.env, config.connectDB
```

### Mixed Exports

**Exporting:**
```javascript
// utils.js
export const helper1 = () => {};
export const helper2 = () => {};
export default mainHelper;
```

**Importing:**
```javascript
import mainHelper, { helper1, helper2 } from './utils.js';
```

## Important Rules

### 1. File Extensions are REQUIRED
```javascript
// ✅ Correct
import User from './models/user.model.js';
import { env } from './config/index.js';

// ❌ Wrong
import User from './models/user.model';
import { env } from './config';
```

### 2. __dirname and __filename Don't Exist
In ES6 modules, use this instead:
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### 3. JSON Imports
To import JSON files:
```javascript
// Option 1: Use import assertion (Node 17.5+)
import data from './data.json' assert { type: 'json' };

// Option 2: Use fs
import { readFileSync } from 'fs';
const data = JSON.parse(readFileSync('./data.json', 'utf-8'));
```

### 4. Dynamic Imports
```javascript
// Static import (top-level)
import express from 'express';

// Dynamic import (can be conditional)
const module = await import('./module.js');

// Or with promise
if (condition) {
  import('./module.js').then(module => {
    // use module
  });
}
```

## Migration Checklist

When converting from CommonJS to ES6:

- [ ] Change `"type": "commonjs"` to `"type": "module"` in package.json
- [ ] Replace `require()` with `import`
- [ ] Replace `module.exports` with `export default` or `export`
- [ ] Add `.js` extension to all local imports
- [ ] Update `__dirname` and `__filename` if used
- [ ] Test all imports/exports

## Project Structure Examples

### Models
```javascript
// user.model.js
import mongoose from 'mongoose';

const User = mongoose.model('User', userSchema);
export default User;
```

### Repositories
```javascript
// user.repository.js
import User from '../models/user.model.js';

class UserRepository { ... }
export default new UserRepository();
```

### Services
```javascript
// user.service.js
import userRepository from '../repositories/user.repository.js';
import AppError from '../utils/appError.js';

class UserService { ... }
export default new UserService();
```

### Controllers
```javascript
// user.controller.js
import userService from '../services/user.service.js';
import catchAsync from '../utils/catchAsync.js';

class UserController { ... }
export default new UserController();
```

### Routes
```javascript
// user.routes.js
import express from 'express';
import userController from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import { userValidation } from '../validators/user.validator.js';

const router = express.Router();
// routes...
export default router;
```

### Middlewares
```javascript
// errorHandler.js
import { env } from '../config/index.js';

const errorHandler = (err, req, res, next) => { ... };
export default errorHandler;
```

### Config
```javascript
// config/index.js
import env from './env.js';
import connectDB from './database.js';

export { env, connectDB };
```

## Benefits of ES6 Modules

1. **Standard:** Official JavaScript module system
2. **Tree Shaking:** Better for bundlers to eliminate dead code
3. **Static Analysis:** Imports are analyzed at compile time
4. **Cleaner Syntax:** More readable and consistent
5. **Better IDE Support:** Improved autocomplete and refactoring
6. **Async by Default:** Top-level await support

## Common Errors and Solutions

### Error: Cannot find module
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```
**Solution:** Add `.js` extension to import path

### Error: require is not defined
```
ReferenceError: require is not defined in ES module scope
```
**Solution:** Use `import` instead of `require`

### Error: __dirname is not defined
```
ReferenceError: __dirname is not defined in ES module scope
```
**Solution:**
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### Error: module.exports is not defined
```
ReferenceError: module is not defined in ES module scope
```
**Solution:** Use `export default` or `export`

## Running the Application

```bash
# Development
npm run dev

# Production
npm start

# The server will start with ES6 modules enabled
```

## Testing with ES6 Modules

Update your Jest configuration:
```json
{
  "type": "module",
  "transform": {},
  "testMatch": ["**/*.test.js"],
  "moduleNameMapper": {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
}
```

## References

- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [MDN Import Statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [MDN Export Statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
