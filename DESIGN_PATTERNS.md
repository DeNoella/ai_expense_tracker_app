# FinWise - Software Design Patterns

## Implemented Design Pattern: Repository Pattern

### Overview
The Repository Pattern is implemented in the backend to abstract database operations and provide a clean interface for data access.

### Implementation

#### 1. Database Repository (config/database.js)
The database connection pool acts as a repository abstraction layer:

```javascript
// Provides centralized database access
const pool = require('../config/database');

// All routes use this single repository
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

#### 2. Route Controllers (routes/)
Each route file acts as a repository interface:

- **auth.js** - User repository operations
- **expenses.js** - Expense repository operations
- **budget.js** - Budget repository operations
- **ai.js** - AI analysis operations
- **chat.js** - Chat history operations

### Benefits

1. **Separation of Concerns:** Database logic is separated from business logic
2. **Testability:** Easy to mock database operations
3. **Maintainability:** Changes to database structure only affect repository layer
4. **Reusability:** Database queries can be reused across different parts of the application

### Example Usage

```javascript
// In routes/expenses.js
router.get('/', async (req, res) => {
  // Repository pattern: Abstract database access
  const result = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1',
    [req.user.userId]
  );
  res.json({ expenses: result.rows });
});
```

### Alternative Patterns Considered

1. **MVC Pattern:** Could separate into Models, Views, Controllers
2. **Factory Pattern:** Could use for creating different types of expenses
3. **Observer Pattern:** Could use for real-time updates

### Future Enhancements

- Create explicit repository classes
- Add caching layer
- Implement unit of work pattern
- Add repository interfaces for better abstraction

