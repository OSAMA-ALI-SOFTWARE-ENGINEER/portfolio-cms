# 🚀 Quick Start Guide - Run Your Portfolio

## ⚡ Fast Setup (3 Steps)

### Step 1: Install Dependencies

**Frontend (Root Directory):**
```powershell
npm install
```

**Backend:**
```powershell
cd backend
npm install
cd ..
```

### Step 2: Setup Environment

Create `.env` file in `backend` folder:

**For MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

**For MySQL:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_cms
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### Step 3: Run the Project

**Option A: Use Batch Files (Easiest)**
- Double-click `start-backend.bat` (opens in new window)
- Double-click `start-frontend.bat` (opens in new window)

**Option B: Manual Commands**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
npm start
```

## ✅ Success!

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000
- **API Health:** http://localhost:5000/api/health

## 🐛 Fixed Issues

✅ Fixed `react-scripts` version from `^0.0.0` to `^5.0.1`

## 📝 What to Do Now

1. **Open PowerShell** in project root
2. **Run:** `npm install` (installs frontend dependencies)
3. **Run:** `cd backend` then `npm install` (installs backend dependencies)
4. **Start MySQL** in XAMPP Control Panel (if using MySQL)
5. **Run backend:** `cd backend` then `npm run dev`
6. **Run frontend:** Open new terminal, run `npm start`

---

**Need help?** See `RUN_PROJECT.md` for detailed instructions.

