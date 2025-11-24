# FinWise - Smart Expense Tracker

FinWise is a modern, intelligent expense tracking application that helps you manage your finances with AI-powered insights. Built with Next.js for the frontend and Node.js for the backend.

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes

### 📊 Dashboard
- Real-time expense overview
- Total monthly expenses and income tracking
- Budget usage visualization
- AI-generated insights
- Interactive charts:
  - Expense distribution by category (Pie Chart)
  - Spending trends over 6 months (Line Chart)

### 💰 Expense Management
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Shopping, Entertainment, Bills, Healthcare, Education, Other)
- Filter expenses by category, date range
- View complete expense history

### 🎯 Budget Management
- Set monthly budget
- Track budget usage percentage
- Real-time remaining budget calculation
- Income tracking

### 🤖 AI Assistant
- Natural language queries about your expenses
- Smart insights and recommendations
- Budget tracking assistance
- Spending predictions
- Cost-saving suggestions
- Chat history persistence

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai_expense_tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=finwise
DB_PASSWORD=123
DB_PORT=5432
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE finwise;
```

The application will automatically create all necessary tables on first run.

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Option 1: Run Both Together (Recommended)

From the **root directory**, simply run:

```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### First Time Setup

If you haven't installed dependencies yet, from the root directory:

```bash
npm run install:all
```

This will install dependencies for root, backend, and frontend.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
ai_expense_tracker/
├── backend/
│   ├── config/
│   │   └── database.js       # PostgreSQL connection & schema
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── expenses.js       # Expense CRUD routes
│   │   ├── budget.js         # Budget & income routes
│   │   ├── ai.js             # AI analysis routes
│   │   └── chat.js           # Chat history routes
│   └── index.js              # Express server entry point
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/        # Dashboard page
│   │   ├── expenses/         # Expense management page
│   │   ├── ai-chat/          # AI chat interface
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── components/
│   │   ├── Layout.tsx        # Main layout with navigation
│   │   ├── ExpensePieChart.tsx
│   │   └── ExpenseTrendChart.tsx
│   └── lib/
│       ├── api.ts            # API client
│       └── auth.ts           # Auth utilities
│
└── README.md
```

## 🗄️ Database Schema

### Users
- `id` - Primary key
- `full_name` - User's full name
- `email` - Unique email address
- `password_hashed` - Hashed password
- `created_at` - Timestamp

### Expenses
- `id` - Primary key
- `user_id` - Foreign key to users
- `category` - Expense category
- `amount` - Expense amount
- `date` - Expense date
- `description` - Optional description
- `created_at` - Timestamp

### Budget
- `id` - Primary key
- `user_id` - Foreign key to users (unique)
- `monthly_budget` - Monthly budget amount
- `created_at` - Timestamp
- `updated_at` - Last update timestamp

### Income
- `id` - Primary key
- `user_id` - Foreign key to users
- `amount` - Income amount
- `source` - Income source (optional)
- `date` - Income date
- `created_at` - Timestamp

### Chat History
- `id` - Primary key
- `user_id` - Foreign key to users
- `message` - User's message
- `response` - AI response
- `created_at` - Timestamp

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `GET /api/expenses/:id` - Get expense by ID (protected)
- `POST /api/expenses` - Create expense (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)
- `GET /api/expenses/stats/summary` - Get expense statistics (protected)

### Budget
- `GET /api/budget` - Get budget info (protected)
- `POST /api/budget` - Set/update budget (protected)
- `GET /api/budget/income` - Get total income (protected)
- `POST /api/budget/income` - Add income (protected)

### AI
- `POST /api/ai/analyze` - Analyze expense query (protected)

### Chat
- `GET /api/chat/history` - Get chat history (protected)
- `DELETE /api/chat/history` - Clear chat history (protected)

## 🎨 UI Features

- Modern, clean interface with gradient accents
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Intuitive navigation
- Real-time data updates
- Beautiful data visualizations

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- SQL injection prevention (parameterized queries)

## 🚧 Future Enhancements

- Receipt image upload and OCR
- Multi-currency support
- Export expense reports (PDF, CSV)
- Email notifications for budget alerts
- Mobile app version
- Advanced AI predictions using machine learning
- Recurring expense tracking
- Expense sharing with family/friends

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@finwise.app or create an issue in the repository.

---

**FinWise** - Your intelligent financial companion 🚀
