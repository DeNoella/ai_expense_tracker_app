# Sequence Diagram - FinWise Expense Tracker

## User Registration Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Fill Registration Form
    User->>Frontend: Click "Create Account"
    Frontend->>Frontend: Validate Form Data
    Frontend->>Backend: POST /api/auth/register<br/>{full_name, email, password}
    Backend->>Backend: Validate Input
    Backend->>Database: SELECT email FROM users<br/>WHERE email = ?
    Database-->>Backend: Return result
    alt Email Already Exists
        Backend-->>Frontend: 400 {error: "Email already registered"}
        Frontend-->>User: Show Error Message
    else Email Available
        Backend->>Backend: Hash Password (bcrypt)
        Backend->>Database: INSERT INTO users<br/>(full_name, email, password_hashed)
        Database-->>Backend: Return user data
        Backend->>Backend: Generate JWT Token
        Backend-->>Frontend: 201 {token, user}
        Frontend->>Frontend: Store token in localStorage
        Frontend->>Frontend: Store user in localStorage
        Frontend->>Frontend: Redirect to /dashboard
        Frontend-->>User: Show Dashboard
    end
```

## User Login Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter Email & Password
    User->>Frontend: Click "Sign In"
    Frontend->>Frontend: Validate Form Data
    Frontend->>Backend: POST /api/auth/login<br/>{email, password}
    Backend->>Backend: Validate Input
    Backend->>Database: SELECT * FROM users<br/>WHERE email = ?
    Database-->>Backend: Return user data
    alt User Not Found
        Backend-->>Frontend: 401 {error: "Invalid email or password"}
        Frontend-->>User: Show Error Message
    else User Found
        Backend->>Backend: Compare Password (bcrypt.compare)
        alt Password Incorrect
            Backend-->>Frontend: 401 {error: "Invalid email or password"}
            Frontend-->>User: Show Error Message
        else Password Correct
            Backend->>Backend: Generate JWT Token
            Backend-->>Frontend: 200 {token, user}
            Frontend->>Frontend: Store token in localStorage
            Frontend->>Frontend: Store user in localStorage
            Frontend->>Frontend: Redirect to /dashboard
            Frontend-->>User: Show Dashboard
        end
    end
```

## Add Expense Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Click "Add Expense"
    Frontend-->>User: Show Expense Form
    User->>Frontend: Fill Form (category, amount, date, description)
    User->>Frontend: Click "Add Expense"
    Frontend->>Frontend: Validate Form Data
    Frontend->>Frontend: Get JWT Token from localStorage
    Frontend->>Backend: POST /api/expenses<br/>Authorization: Bearer {token}<br/>{category, amount, date, description}
    Backend->>Backend: Verify JWT Token
    alt Token Invalid
        Backend-->>Frontend: 401 {error: "Invalid or expired token"}
        Frontend->>Frontend: Clear localStorage
        Frontend->>Frontend: Redirect to /login
    else Token Valid
        Backend->>Backend: Extract userId from token
        Backend->>Backend: Validate Expense Data
        alt Invalid Data
            Backend-->>Frontend: 400 {error: "Validation error"}
            Frontend-->>User: Show Error Message
        else Valid Data
            Backend->>Database: INSERT INTO expenses<br/>(user_id, category, amount, date, description)
            Database-->>Backend: Return expense data
            Backend-->>Frontend: 201 {expense}
            Frontend->>Frontend: Close Modal
            Frontend->>Frontend: Refresh Expense List
            Frontend->>Backend: GET /api/expenses<br/>Authorization: Bearer {token}
            Backend->>Backend: Verify JWT Token
            Backend->>Database: SELECT * FROM expenses<br/>WHERE user_id = ?
            Database-->>Backend: Return expenses
            Backend-->>Frontend: 200 {expenses: [...]}
            Frontend-->>User: Display Updated Expense List
        end
    end
```

## View Dashboard Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Navigate to /dashboard
    Frontend->>Frontend: Check Authentication
    Frontend->>Frontend: Get JWT Token from localStorage
    Frontend->>Backend: GET /api/expenses/stats/summary<br/>Authorization: Bearer {token}
    Frontend->>Backend: GET /api/budget<br/>Authorization: Bearer {token}
    Frontend->>Backend: GET /api/budget/income<br/>Authorization: Bearer {token}
    
    par Get Expense Statistics
        Backend->>Backend: Verify JWT Token
        Backend->>Backend: Extract userId
        Backend->>Database: SELECT SUM(amount) FROM expenses<br/>WHERE user_id = ? AND month = ?
        Backend->>Database: SELECT category, SUM(amount) FROM expenses<br/>WHERE user_id = ? GROUP BY category
        Backend->>Database: SELECT month, year, SUM(amount) FROM expenses<br/>WHERE user_id = ? AND date >= ?
        Database-->>Backend: Return statistics
        Backend-->>Frontend: 200 {totalExpenses, byCategory, trend}
    and Get Budget
        Backend->>Backend: Verify JWT Token
        Backend->>Backend: Extract userId
        Backend->>Database: SELECT * FROM budget WHERE user_id = ?
        Database-->>Backend: Return budget
        Backend->>Database: SELECT SUM(amount) FROM expenses<br/>WHERE user_id = ? AND month = ?
        Database-->>Backend: Return spent amount
        Backend->>Backend: Calculate remaining & usage %
        Backend-->>Frontend: 200 {budget: {monthly_budget, spent, remaining, usagePercent}}
    and Get Income
        Backend->>Backend: Verify JWT Token
        Backend->>Backend: Extract userId
        Backend->>Database: SELECT SUM(amount) FROM income<br/>WHERE user_id = ? AND month = ?
        Database-->>Backend: Return total income
        Backend-->>Frontend: 200 {totalIncome}
    end
    
    Frontend->>Frontend: Process All Data
    Frontend->>Frontend: Generate Insights
    Frontend->>Frontend: Render Charts
    Frontend-->>User: Display Dashboard with Stats, Charts & Insights
```

## AI Chat Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant AIEngine
    
    User->>Frontend: Type Question
    User->>Frontend: Click "Send"
    Frontend->>Frontend: Validate Input
    Frontend->>Frontend: Get JWT Token from localStorage
    Frontend->>Backend: POST /api/ai/analyze<br/>Authorization: Bearer {token}<br/>{message: "How much did I spend on food?"}
    
    Backend->>Backend: Verify JWT Token
    Backend->>Backend: Extract userId
    
    par Fetch User Data
        Backend->>Database: SELECT * FROM expenses<br/>WHERE user_id = ? AND month = ?
        Database-->>Backend: Return expenses
        Backend->>Database: SELECT category, SUM(amount) FROM expenses<br/>WHERE user_id = ? GROUP BY category
        Database-->>Backend: Return category totals
        Backend->>Database: SELECT monthly_budget FROM budget<br/>WHERE user_id = ?
        Database-->>Backend: Return budget
        Backend->>Database: SELECT SUM(amount) FROM income<br/>WHERE user_id = ? AND month = ?
        Database-->>Backend: Return income
        Backend->>Database: SELECT month, year, SUM(amount) FROM expenses<br/>WHERE user_id = ? AND date >= ?
        Database-->>Backend: Return trend data
    end
    
    Backend->>Backend: Aggregate All Data
    Backend->>AIEngine: Analyze Query with Data
    AIEngine->>AIEngine: Process Natural Language
    AIEngine->>AIEngine: Calculate Insights
    AIEngine->>AIEngine: Generate Response
    AIEngine-->>Backend: Return AI Response
    
    Backend->>Database: INSERT INTO chat_history<br/>(user_id, message, response)
    Database-->>Backend: Return saved record
    
    Backend-->>Frontend: 200 {response, data}
    Frontend->>Frontend: Display AI Response
    Frontend-->>User: Show Answer
```

## Set Budget Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Click "Set Budget"
    Frontend-->>User: Show Budget Modal
    User->>Frontend: Enter Monthly Budget Amount
    User->>Frontend: Click "Set Budget"
    Frontend->>Frontend: Validate Input
    Frontend->>Frontend: Get JWT Token from localStorage
    Frontend->>Backend: POST /api/budget<br/>Authorization: Bearer {token}<br/>{monthly_budget: 5000}
    
    Backend->>Backend: Verify JWT Token
    Backend->>Backend: Extract userId
    Backend->>Backend: Validate Budget Amount
    Backend->>Database: SELECT id FROM budget<br/>WHERE user_id = ?
    Database-->>Backend: Return result
    
    alt Budget Exists
        Backend->>Database: UPDATE budget<br/>SET monthly_budget = ?, updated_at = NOW()<br/>WHERE user_id = ?
        Database-->>Backend: Return updated budget
    else Budget Doesn't Exist
        Backend->>Database: INSERT INTO budget<br/>(user_id, monthly_budget)
        Database-->>Backend: Return new budget
    end
    
    Backend->>Database: SELECT SUM(amount) FROM expenses<br/>WHERE user_id = ? AND month = ?
    Database-->>Backend: Return spent amount
    Backend->>Backend: Calculate remaining & usage %
    Backend-->>Frontend: 200 {budget: {monthly_budget, spent, remaining, usagePercent}}
    Frontend->>Frontend: Close Modal
    Frontend->>Frontend: Update Budget Card
    Frontend-->>User: Display Updated Budget Info
```

## Delete Expense Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Click Delete Button on Expense
    Frontend-->>User: Show Confirmation Dialog
    User->>Frontend: Confirm Delete
    
    Frontend->>Frontend: Get JWT Token from localStorage
    Frontend->>Backend: DELETE /api/expenses/:id<br/>Authorization: Bearer {token}
    
    Backend->>Backend: Verify JWT Token
    Backend->>Backend: Extract userId
    Backend->>Database: SELECT user_id FROM expenses<br/>WHERE id = ?
    Database-->>Backend: Return expense
    
    alt Expense Not Found
        Backend-->>Frontend: 404 {error: "Expense not found"}
        Frontend-->>User: Show Error Message
    else Expense Belongs to User
        Backend->>Database: DELETE FROM expenses<br/>WHERE id = ? AND user_id = ?
        Database-->>Backend: Return deleted id
        Backend-->>Frontend: 200 {message: "Expense deleted successfully"}
        Frontend->>Frontend: Remove from UI
        Frontend->>Frontend: Refresh Expense List
        Frontend->>Backend: GET /api/expenses<br/>Authorization: Bearer {token}
        Backend->>Backend: Verify JWT Token
        Backend->>Database: SELECT * FROM expenses<br/>WHERE user_id = ?
        Database-->>Backend: Return expenses
        Backend-->>Frontend: 200 {expenses: [...]}
        Frontend-->>User: Display Updated Expense List
    else Expense Doesn't Belong to User
        Backend-->>Frontend: 404 {error: "Expense not found"}
        Frontend-->>User: Show Error Message
    end
```

## Complete Authentication Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Frontend
    participant Backend
    participant Database
    
    User->>Browser: Open http://localhost:3000
    Browser->>Frontend: Load Application
    Frontend->>Frontend: Check localStorage for token
    alt Token Exists
        Frontend->>Backend: GET /api/auth/me<br/>Authorization: Bearer {token}
        Backend->>Backend: Verify JWT Token
        alt Token Valid
            Backend->>Database: SELECT * FROM users WHERE id = ?
            Database-->>Backend: Return user
            Backend-->>Frontend: 200 {user}
            Frontend->>Frontend: Set authenticated state
            Frontend-->>Browser: Render Dashboard
            Browser-->>User: Show Dashboard
        else Token Invalid
            Backend-->>Frontend: 401 {error: "Invalid token"}
            Frontend->>Frontend: Clear localStorage
            Frontend-->>Browser: Render Login Page
            Browser-->>User: Show Login Page
        end
    else No Token
        Frontend-->>Browser: Render Login Page
        Browser-->>User: Show Login Page
    end
```

