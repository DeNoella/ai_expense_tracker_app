# Debugging Registration Issues

## 🔍 Step-by-Step Debugging

### Step 1: Check if Backend is Running

Open your browser and go to:
```
http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FinWise API is running",
  "database": "connected"
}
```

**If you get an error:**
- Backend is not running
- Start it: `cd backend && npm run dev`

### Step 2: Check Browser Console

1. Open browser DevTools (Press F12)
2. Go to **Console** tab
3. Try to register again
4. Look for error messages

**What to look for:**
- `🔗 API URL: http://localhost:5000/api` - Should see this
- `📝 Attempting registration...` - Should see this when you click register
- Any red error messages

### Step 3: Check Network Tab

1. Open browser DevTools (Press F12)
2. Go to **Network** tab
3. Try to register again
4. Look for the request to `/api/auth/register`

**Check:**
- Status code (should be 201 for success, 400/500 for errors)
- Response body (click on the request to see response)
- Request payload (check if data is being sent)

### Step 4: Check Backend Terminal

Look at the terminal where backend is running. You should see:

**On successful registration:**
```
📥 Registration request received
📝 Registration attempt: { email: '...', hasPassword: true, ... }
🔍 Checking if user exists...
✅ Email is available
🔐 Hashing password...
✅ Password hashed
💾 Inserting user into database...
✅ User inserted: user@example.com
```

**On error:**
```
❌ Registration error: { message: '...', code: '...' }
```

## 🐛 Common Errors and Solutions

### Error: "Cannot connect to server"
**Solution:**
- Backend is not running
- Start backend: `cd backend && npm run dev`
- Check if port 5000 is available

### Error: "Database connection failed"
**Solution:**
1. Check if PostgreSQL is running
2. Verify database exists:
   ```sql
   CREATE DATABASE finwise;
   ```
3. Check `backend/.env` file:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=finwise
   DB_PASSWORD=123
   DB_PORT=5432
   ```

### Error: "Email already registered"
**Solution:**
- The email is already in the database
- Try a different email
- Or use the login page instead

### Error: "All fields are required"
**Solution:**
- Make sure all form fields are filled:
  - Full Name
  - Email
  - Password (at least 6 characters)

### Error: "Internal server error"
**Solution:**
- Check backend terminal for detailed error
- Usually a database issue
- Check database connection and credentials

## 📋 Quick Checklist

- [ ] Backend is running (`http://localhost:5000/api/health` works)
- [ ] Frontend is running (`http://localhost:3000` loads)
- [ ] PostgreSQL is running
- [ ] Database `finwise` exists
- [ ] `backend/.env` file exists with correct credentials
- [ ] `frontend/.env.local` file exists (optional, has defaults)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows the request being made

## 🧪 Test Registration Manually

You can test the registration endpoint directly using curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Expected Success Response:**
```json
{
  "message": "User registered successfully",
  "token": "...",
  "user": {
    "id": 1,
    "full_name": "Test User",
    "email": "test@example.com"
  }
}
```

## 📞 Still Having Issues?

1. **Share the exact error message** from:
   - Browser console
   - Backend terminal
   - Network tab response

2. **Check these files:**
   - `backend/.env` - Database credentials
   - `frontend/.env.local` - API URL (optional)

3. **Verify services:**
   - PostgreSQL service is running
   - Backend server is running
   - Frontend server is running

