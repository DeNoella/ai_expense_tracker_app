# How to Run FinWise

## 🚀 Option 1: Run Both Together (Recommended)

From the **root directory**, run:

```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously in the same terminal window.

## 🚀 Option 2: Run Separately in Different Terminals

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 🚀 Option 3: Using PowerShell (Windows)

### Option 3a: Two PowerShell Windows
Open **two separate PowerShell windows**:

**Window 1:**
```powershell
cd backend
npm run dev
```

**Window 2:**
```powershell
cd frontend
npm run dev
```

### Option 3b: PowerShell with Background Jobs
In a single PowerShell window:

```powershell
# Start backend in background
Start-Job -ScriptBlock { cd backend; npm run dev }

# Start frontend in foreground
cd frontend
npm run dev
```

## 📝 Available Scripts

From the **root directory**:

- `npm run dev` - Run both backend and frontend in development mode
- `npm run dev:backend` - Run only backend
- `npm run dev:frontend` - Run only frontend
- `npm run install:all` - Install dependencies for root, backend, and frontend
- `npm run start` - Run both in production mode
- `npm run build` - Build frontend for production

## ⚠️ Important Notes

1. **Ports Used:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **First Time Setup:**
   - Make sure you've run `npm install` in both `backend/` and `frontend/` directories
   - Or run `npm run install:all` from the root directory

3. **Database:**
   - Ensure PostgreSQL is running
   - Database tables are created automatically on first backend start

4. **Environment Variables:**
   - Backend: Create `backend/.env` file
   - Frontend: Create `frontend/.env.local` file

## 🐛 Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
- Check if another instance is running: `netstat -ano | findstr :5000` (Windows)
- Kill the process or change the port in `.env` file

### Concurrently Not Found
If `npm run dev` doesn't work:
```bash
npm install
```

### Can't See Both Outputs
When using `npm run dev`, you'll see output from both servers with prefixes:
- `[backend]` - Backend server logs
- `[frontend]` - Frontend server logs

## ✅ Verify It's Working

1. Backend should show: `🚀 FinWise API server running on port 5000`
2. Frontend should show: `Ready on http://localhost:3000`
3. Open browser to: `http://localhost:3000`

Enjoy! 🎉

