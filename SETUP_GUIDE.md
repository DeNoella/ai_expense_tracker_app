# FinWise - Final Exam Requirements Setup Guide

## Quick Setup Checklist

### ✅ Already Complete
1. ✅ Topic Selection - FinWise Expense Tracker
2. ✅ Software Design - Three diagrams created
3. ✅ Programming Language - TypeScript/JavaScript
4. ✅ Basic Code Structure

### ⚠️ Need to Complete

## 1. Initialize Git Repository

```bash
# In project root
git init
git add .
git commit -m "Initial commit: FinWise Expense Tracker"
```

## 2. Create GitHub Repository

1. Go to GitHub.com
2. Create new repository: "finwise-expense-tracker"
3. Connect local repository:

```bash
git remote add origin https://github.com/yourusername/finwise-expense-tracker.git
git branch -M main
git push -u origin main
```

## 3. Set Up Testing

### Backend Testing
```bash
cd backend
npm install --save-dev jest supertest
```

### Frontend Testing
```bash
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 4. Docker Setup

### Build and Run with Docker
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

## 5. Code Quality Setup

### ESLint (Frontend)
```bash
cd frontend
npm install --save-dev eslint-config-next
```

### Prettier
```bash
npm install --save-dev prettier
```

## 6. Create PowerPoint Presentation

Include:
- Title: "FinWise - AI-Powered Expense Tracker"
- Problem Statement
- Solution Overview
- Three Diagrams (Activity, Data Flow, Sequence)
- Technology Stack
- Features
- Demo Screenshots

## 7. Documentation

All documentation files created:
- ✅ README.md
- ✅ FINAL_EXAM_REQUIREMENTS.md
- ✅ TESTING_PLAN.md
- ✅ DESIGN_PATTERNS.md
- ✅ SETUP_GUIDE.md (this file)

## Next Steps

1. Initialize Git and push to GitHub
2. Write unit tests
3. Create PowerPoint presentation
4. Test Docker setup
5. Review code for best practices

