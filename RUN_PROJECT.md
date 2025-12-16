# 🚀 How to Run Your Portfolio Project

This guide will help you run both the frontend (React) and backend (Node.js) of your portfolio.

## 📋 Prerequisites

1. **Node.js** installed (v16 or higher)
2. **XAMPP** with MySQL running (for database)
3. **npm** (comes with Node.js)

## 🔧 Step 1: Install Frontend Dependencies

Open PowerShell in the project root directory and run:

```powershell
npm install
```

This will install all React dependencies including `react-scripts`.

## 🔧 Step 2: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```powershell
cd backend
npm install
cd ..
```

## 🗄️ Step 3: Setup Database (MySQL)

### Option A: Using MongoDB (Current Setup)
1. Make sure MongoDB is running
2. Create `.env` file in `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

### Option B: Using MySQL (New Setup)
1. Start MySQL in XAMPP Control Panel
2. Create `.env` file in `backend` directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=portfolio_cms
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
3. Initialize database:
   ```powershell
   cd backend
   npm run db:init
   cd ..
   ```

## 🚀 Step 4: Run the Project

### Terminal 1: Start Backend Server

```powershell
cd backend
npm run dev
```

The backend will run on: `http://localhost:5000`

### Terminal 2: Start Frontend (React App)

```powershell
npm start
```

The frontend will run on: `http://localhost:3000`

## 📝 Quick Commands Summary

### Frontend (Root Directory)
```powershell
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend (backend directory)
```powershell
# Install dependencies
cd backend
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Initialize MySQL database
npm run db:init
```

## 🐛 Troubleshooting

### "react-scripts is not recognized"
**Solution:** Run `npm install` in the root directory

### "Cannot find module"
**Solution:** 
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Port already in use
**Solution:** 
- Change PORT in `.env` file
- Or kill the process using the port:
  ```powershell
  # Find process on port 3000
  netstat -ano | findstr :3000
  # Kill process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

### Database connection error
**Solution:**
- Check if MySQL/MongoDB is running
- Verify credentials in `.env` file
- For MySQL: Run `npm run db:init` in backend directory

## ✅ Success Indicators

When everything is running correctly, you should see:

**Backend:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**Frontend:**
```
Compiled successfully!
You can now view portfolio in the browser.
  Local:            http://localhost:3000
```

## 📚 Additional Resources

- Backend API: `http://localhost:5000/api/health`
- Frontend: `http://localhost:3000`
- MySQL Setup: See `backend/database/QUICK_START.md`

---

**Happy Coding! 🎉**

