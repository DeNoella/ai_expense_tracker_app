# Data Flow Diagram - FinWise Expense Tracker

## Level 0 - Context Diagram

```mermaid
flowchart LR
    User[User] -->|HTTP Requests| Frontend[Next.js Frontend]
    Frontend -->|API Calls| Backend[Express Backend]
    Backend -->|SQL Queries| Database[(PostgreSQL Database)]
    Backend -->|Returns Data| Frontend
    Frontend -->|Renders UI| User
    
    style User fill:#e1f5ff
    style Frontend fill:#fff4e6
    style Backend fill:#f3e5f5
    style Database fill:#e8f5e9
```

## Level 1 - System Overview

```mermaid
flowchart TB
    subgraph "Frontend Layer"
        UI[User Interface]
        AuthState[Auth State Management]
        APIClient[API Client]
    end
    
    subgraph "Backend Layer"
        APIRoutes[API Routes]
        Middleware[Auth Middleware]
        Controllers[Controllers]
        Services[Business Logic]
    end
    
    subgraph "Data Layer"
        Database[(PostgreSQL)]
    end
    
    User[User] --> UI
    UI --> AuthState
    UI --> APIClient
    APIClient -->|HTTP Requests| APIRoutes
    APIRoutes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services -->|SQL Queries| Database
    Database -->|Query Results| Services
    Services -->|Processed Data| Controllers
    Controllers -->|JSON Response| APIRoutes
    APIRoutes -->|JSON Response| APIClient
    APIClient --> AuthState
    APIClient --> UI
    UI --> User
    
    style User fill:#e1f5ff
    style Database fill:#e8f5e9
```

## Authentication Data Flow

```mermaid
flowchart TD
    User[User] -->|1. Enter Credentials| Frontend[Frontend Form]
    Frontend -->|2. POST /api/auth/register| Backend[Backend API]
    
    Backend -->|3. Validate Input| Validation{Valid?}
    Validation -->|No| Error1[Return Error]
    Error1 --> Frontend
    
    Validation -->|Yes| CheckDB{Email<br/>Exists?}
    CheckDB -->|Yes| Error2[Return Error]
    Error2 --> Frontend
    
    CheckDB -->|No| Hash[Hash Password]
    Hash -->|4. INSERT INTO users| Database[(Database)]
    Database -->|5. Return User Data| Backend
    Backend -->|6. Generate JWT| Token[Create Token]
    Token -->|7. Return Token + User| Frontend
    Frontend -->|8. Store in localStorage| Storage[localStorage]
    Storage -->|9. Redirect| Dashboard[Dashboard]
    
    style User fill:#e1f5ff
    style Database fill:#e8f5e9
    style Storage fill:#fff4e6
```

## Expense Management Data Flow

```mermaid
flowchart TD
    User[User] -->|1. Create Expense| Frontend[Expense Form]
    Frontend -->|2. POST /api/expenses| Backend[Backend API]
    
    Backend -->|3. Verify JWT| Auth{Authenticated?}
    Auth -->|No| Error1[401 Unauthorized]
    Error1 --> Frontend
    
    Auth -->|Yes| Validate{Valid Data?}
    Validate -->|No| Error2[400 Bad Request]
    Error2 --> Frontend
    
    Validate -->|Yes| Insert|4. INSERT INTO expenses| Database[(Database)]
    Database -->|5. Return Expense| Backend
    Backend -->|6. Return JSON| Frontend
    Frontend -->|7. Update UI| Dashboard[Dashboard]
    
    Dashboard -->|8. GET /api/expenses/stats| Backend2[Backend API]
    Backend2 -->|9. SELECT SUM, GROUP BY| Database
    Database -->|10. Return Stats| Backend2
    Backend2 -->|11. Return JSON| Dashboard
    Dashboard -->|12. Display Charts| User
    
    style User fill:#e1f5ff
    style Database fill:#e8f5e9
```

## AI Chat Data Flow

```mermaid
flowchart TD
    User[User] -->|1. Type Question| Frontend[Chat Interface]
    Frontend -->|2. POST /api/ai/analyze| Backend[Backend API]
    
    Backend -->|3. Verify JWT| Auth{Authenticated?}
    Auth -->|No| Error1[401 Unauthorized]
    Error1 --> Frontend
    
    Auth -->|Yes| FetchData[4. Fetch User Data]
    FetchData -->|5. SELECT expenses| Database[(Database)]
    FetchData -->|6. SELECT budget| Database
    FetchData -->|7. SELECT income| Database
    
    Database -->|8. Return Data| Backend
    Backend -->|9. Analyze Query| AIEngine[AI Analysis Engine]
    AIEngine -->|10. Process Data| Analysis[Generate Insights]
    Analysis -->|11. Create Response| Response[AI Response]
    Response -->|12. INSERT INTO chat_history| Database
    Database -->|13. Return Saved| Backend
    Backend -->|14. Return Response| Frontend
    Frontend -->|15. Display Message| User
    
    User -->|16. View History| Frontend2[Chat Interface]
    Frontend2 -->|17. GET /api/chat/history| Backend2[Backend API]
    Backend2 -->|18. SELECT FROM chat_history| Database
    Database -->|19. Return History| Backend2
    Backend2 -->|20. Return JSON| Frontend2
    Frontend2 -->|21. Display History| User
    
    style User fill:#e1f5ff
    style Database fill:#e8f5e9
    style AIEngine fill:#f3e5f5
```

## Budget Management Data Flow

```mermaid
flowchart TD
    User[User] -->|1. Set Budget| Frontend[Budget Form]
    Frontend -->|2. POST /api/budget| Backend[Backend API]
    
    Backend -->|3. Verify JWT| Auth{Authenticated?}
    Auth -->|No| Error1[401 Unauthorized]
    Error1 --> Frontend
    
    Auth -->|Yes| CheckBudget{Budget<br/>Exists?}
    CheckBudget -->|Yes| Update|4. UPDATE budget| Database[(Database)]
    CheckBudget -->|No| Insert|4. INSERT INTO budget| Database
    
    Database -->|5. Return Budget| Backend
    Backend -->|6. Return JSON| Frontend
    Frontend -->|7. Update UI| Dashboard[Dashboard]
    
    Dashboard -->|8. GET /api/budget| Backend2[Backend API]
    Backend2 -->|9. SELECT FROM budget| Database
    Backend2 -->|10. SELECT SUM expenses| Database
    Database -->|11. Return Data| Backend2
    Backend2 -->|12. Calculate Usage| Calculate[Calculate %]
    Calculate -->|13. Return JSON| Dashboard
    Dashboard -->|14. Display Usage| User
    
    User -->|15. Add Income| Frontend2[Income Form]
    Frontend2 -->|16. POST /api/budget/income| Backend3[Backend API]
    Backend3 -->|17. Verify JWT| Auth2{Authenticated?}
    Auth2 -->|No| Error2[401 Unauthorized]
    Error2 --> Frontend2
    Auth2 -->|Yes| InsertIncome|18. INSERT INTO income| Database
    Database -->|19. Return Income| Backend3
    Backend3 -->|20. Return JSON| Frontend2
    Frontend2 -->|21. Update Dashboard| Dashboard
    
    style User fill:#e1f5ff
    style Database fill:#e8f5e9
```

## Complete System Data Flow

```mermaid
flowchart TB
    subgraph "Client Side"
        Browser[Web Browser]
        LocalStorage[(localStorage)]
    end
    
    subgraph "Frontend Application"
        Pages[Next.js Pages]
        Components[React Components]
        API[API Client]
    end
    
    subgraph "Backend API"
        Routes[Express Routes]
        Auth[Auth Middleware]
        Controllers[Route Controllers]
    end
    
    subgraph "Database"
        Users[(users table)]
        Expenses[(expenses table)]
        Budget[(budget table)]
        Income[(income table)]
        ChatHistory[(chat_history table)]
    end
    
    Browser --> Pages
    Pages --> Components
    Components --> API
    API <--> LocalStorage
    API -->|HTTP Requests| Routes
    Routes --> Auth
    Auth --> Controllers
    Controllers --> Users
    Controllers --> Expenses
    Controllers --> Budget
    Controllers --> Income
    Controllers --> ChatHistory
    Users --> Controllers
    Expenses --> Controllers
    Budget --> Controllers
    Income --> Controllers
    ChatHistory --> Controllers
    Controllers --> Routes
    Routes -->|JSON Response| API
    API --> Components
    Components --> Pages
    Pages --> Browser
    
    style Browser fill:#e1f5ff
    style LocalStorage fill:#fff4e6
    style Users fill:#e8f5e9
    style Expenses fill:#e8f5e9
    style Budget fill:#e8f5e9
    style Income fill:#e8f5e9
    style ChatHistory fill:#e8f5e9
```

