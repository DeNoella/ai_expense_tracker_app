# FinWise Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Setup Database

1. Make sure PostgreSQL is running
2. Create a database:
```sql
CREATE DATABASE finwise;
```

### Step 3: Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=finwise
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Start the Application

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

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health

## 🎯 First Steps

1. **Register an Account**
   - Go to http://localhost:3000/register
   - Create your account with email and password

2. **Set Your Budget**
   - After logging in, go to Dashboard
   - Click "Set Budget" on the Remaining Budget card
   - Enter your monthly budget amount

3. **Add Your First Expense**
   - Click "Add Expense" button
   - Fill in category, amount, date, and description
   - Save the expense

4. **Try the AI Assistant**
   - Navigate to "AI Assistant" in the menu
   - Ask questions like:
     - "How much did I spend on food this month?"
     - "Am I on track with my budget?"
     - "What category am I spending the most on?"

## 📊 Features to Explore

- **Dashboard:** View your financial overview with charts and insights
- **Expenses:** Manage all your expenses with filtering options
- **AI Chat:** Get intelligent insights about your spending patterns
- **Budget Tracking:** Monitor your budget usage in real-time

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check your database credentials in `backend/.env`
- Verify the database `finwise` exists

### Port Already in Use
- Change `PORT` in `backend/.env` if 5000 is taken
- Change frontend port: `npm run dev -- -p 3001`

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that both servers are running

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 Notes

- The database tables are created automatically on first run
- All API routes require authentication except `/api/auth/register` and `/api/auth/login`
- JWT tokens expire after 7 days
- Chat history is saved per user

Enjoy using FinWise! 🎉

