# 🏗️ NirmanSetu — निर्माण का सेतु
### India's Civil Labour Marketplace — Complete Setup Guide

---

## 📁 PROJECT STRUCTURE

```
nirmansetu/
├── backend/                  ← Node.js + Express API
│   ├── models/
│   │   ├── User.js           ← Worker / Owner / Contractor schema
│   │   ├── Job.js            ← Job postings schema
│   │   └── Review.js         ← Ratings & reviews schema
│   ├── routes/
│   │   ├── auth.js           ← Register, Login, Me
│   │   ├── workers.js        ← List, filter, profile, upload
│   │   ├── jobs.js           ← Post, apply, assign, complete
│   │   └── reviews.js        ← Submit & fetch reviews
│   ├── middleware/
│   │   ├── auth.js           ← JWT protection middleware
│   │   └── upload.js         ← Multer file upload
│   ├── server.js             ← Entry point
│   ├── seed.js               ← Populate 30 sample workers
│   ├── package.json
│   └── .env.example          ← Copy to .env and fill in
│
├── frontend/                 ← React app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  ← Global auth state
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── WorkerCard.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── FindLabour.js   ← Main listing + filters
│   │   │   ├── WorkerDetail.js
│   │   │   ├── Register.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PostJob.js
│   │   │   ├── About.js
│   │   │   └── Pricing.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md                 ← This file
```

---

## 🖥️ WHAT SOFTWARE TO INSTALL (ALL FREE)

### Step 1 — Install these on your PC/Laptop

| Software | What it is | Download Link |
|---|---|---|
| **Node.js** (v18+) | Runs your backend code | https://nodejs.org (download LTS) |
| **VS Code** | Code editor | https://code.visualstudio.com |
| **Git** | Version control | https://git-scm.com |
| **MongoDB Compass** | View your database visually | https://mongodb.com/try/download/compass |

### After installing Node.js, verify it works:
Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux) and type:
```
node --version
npm --version
```
Both should show version numbers. ✅

---

## ☁️ FREE ONLINE SERVICES TO CREATE ACCOUNTS

### 1. MongoDB Atlas (Free Database — 512MB)
1. Go to: **https://cloud.mongodb.com**
2. Click **"Try Free"** → Sign up with Google or email
3. Choose **"Free"** tier (M0 Sandbox)
4. Select region: **Mumbai (ap-south-1)** for India
5. Click **"Create Cluster"** (takes 2-3 minutes)
6. Click **"Connect"** → **"Connect your application"**
7. Copy the connection string — looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/
   ```
8. Save this string — you'll use it in `.env`

### 2. GitHub (Free Code Hosting)
1. Go to: **https://github.com**
2. Sign up for a free account
3. Create a new repository called `nirmansetu`
4. This lets you deploy for free later

### 3. Render.com (Free Backend Hosting)
1. Go to: **https://render.com**
2. Sign up with your GitHub account
3. Free tier gives you 1 free web service (backend)

### 4. Vercel (Free Frontend Hosting)
1. Go to: **https://vercel.com**
2. Sign up with your GitHub account
3. Free tier gives unlimited frontend deployments

---

## 🚀 HOW TO RUN ON YOUR COMPUTER (LOCAL DEVELOPMENT)

### Step 1 — Download/Copy the code
Put the `nirmansetu` folder on your computer.
Open VS Code → File → Open Folder → select `nirmansetu`

### Step 2 — Set up the Backend

Open the **VS Code terminal** (Ctrl+` or View → Terminal):

```bash
# Go into backend folder
cd backend

# Install all dependencies (downloads packages)
npm install

# Copy environment file
# On Windows:
copy .env.example .env
# On Mac/Linux:
cp .env.example .env
```

Now **open the `.env` file** in VS Code and fill it in:

```env
MONGO_URI=mongodb+srv://YourUser:YourPassword@cluster0.xxxxx.mongodb.net/nirmansetu?retryWrites=true&w=majority
JWT_SECRET=NirmanSetu2025SuperSecretKeyForJWT_MakeThisVeryLongAndRandom
JWT_EXPIRE=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
UPLOAD_PATH=./uploads
```

Replace `MONGO_URI` with the string you copied from MongoDB Atlas.

### Step 3 — Seed Sample Workers into Database

```bash
# Still inside backend/ folder
node seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing workers
✅ Seeded 30 workers successfully!
```

### Step 4 — Start the Backend Server

```bash
# Still inside backend/ folder
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 NirmanSetu server running on http://localhost:5000
```

**Leave this terminal open.**

### Step 5 — Set up and Run the Frontend

Open a **NEW terminal tab** in VS Code (click the + icon):

```bash
# Go into frontend folder
cd frontend

# Install React dependencies (takes 2-3 minutes)
npm install

# Start the React app
npm start
```

Your browser will automatically open: **http://localhost:3000** ✅

You now have:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Test API: http://localhost:5000/api/health

---

## 🧪 TESTING THE APP

### Test 1 — Check API is working
Open browser → go to: `http://localhost:5000/api/health`
Should show: `{"success":true,"message":"NirmanSetu API is running 🏗️"}`

### Test 2 — View workers
`http://localhost:5000/api/workers`
Should show 30 seeded workers as JSON.

### Test 3 — Register a new user
Go to: `http://localhost:3000/register`
Register as a Worker with any details.

### Test 4 — Login
Go to: `http://localhost:3000/login`
Login with the mobile + password you just registered.

---

## 🌐 HOW TO PUT IT ONLINE (FREE DEPLOYMENT)

### Phase 1 — Push code to GitHub

```bash
# From the nirmansetu/ root folder
git init
git add .
git commit -m "Initial NirmanSetu commit"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/nirmansetu.git
git push -u origin main
```

### Phase 2 — Deploy Backend on Render.com (FREE)

1. Login to **render.com**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub → select `nirmansetu` repo
4. Fill in settings:
   - **Name:** `nirmansetu-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Click **"Advanced"** → **"Add Environment Variable"**
   Add all your `.env` values one by one:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
   - `FRONTEND_URL` = https://nirmansetu.vercel.app (add after Step 3)
6. Click **"Create Web Service"**
7. Wait 3-5 minutes. You'll get a URL like:
   `https://nirmansetu-api.onrender.com`
8. **Run seed on Render:** In your Render dashboard → Shell tab → type:
   `node seed.js`

### Phase 3 — Deploy Frontend on Vercel (FREE)

1. Login to **vercel.com**
2. Click **"Add New"** → **"Project"**
3. Import your `nirmansetu` GitHub repo
4. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
5. Add **Environment Variable:**
   - `REACT_APP_API_URL` = `https://nirmansetu-api.onrender.com`
6. Click **"Deploy"**
7. Wait 2-3 minutes → You get a URL like:
   `https://nirmansetu.vercel.app`

### Phase 4 — Update Backend CORS

Go back to Render → Environment Variables → update:
```
FRONTEND_URL = https://nirmansetu.vercel.app
```
Click **"Save Changes"** → Render auto-redeploys.

---

## 📱 ALL API ENDPOINTS REFERENCE

### Auth
| Method | URL | What it does | Auth needed? |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, get JWT token | No |
| GET  | `/api/auth/me` | Get logged-in user info | Yes |
| PUT  | `/api/auth/updatepassword` | Change password | Yes |

### Workers
| Method | URL | What it does | Auth needed? |
|---|---|---|---|
| GET  | `/api/workers` | List all workers (with filters) | No |
| GET  | `/api/workers/:id` | Single worker profile | No |
| PUT  | `/api/workers/profile` | Update own profile | Yes (worker) |
| POST | `/api/workers/photo` | Upload profile photo | Yes (worker) |
| POST | `/api/workers/workphotos` | Upload portfolio photos | Yes (worker) |
| GET  | `/api/workers/meta/states` | List all states with workers | No |
| GET  | `/api/workers/meta/districts?state=X` | Districts in a state | No |

### Filter Parameters for GET /api/workers
```
?state=Rajasthan
?district=Jaipur
?village=Rampur
?skill=Mason
?maxRate=600
?minRate=300
?available=true
?verified=true
?sort=rating          (rating, rate-low, rate-high, exp, newest)
?page=1
?limit=12
```
Example: `/api/workers?state=Rajasthan&skill=Mason&maxRate=700&available=true`

### Jobs
| Method | URL | What it does | Auth needed? |
|---|---|---|---|
| GET  | `/api/jobs` | List open jobs | No |
| POST | `/api/jobs` | Post a new job | Yes (owner) |
| GET  | `/api/jobs/:id` | Single job detail | No |
| POST | `/api/jobs/:id/apply` | Worker applies | Yes (worker) |
| PUT  | `/api/jobs/:id/assign/:workerId` | Assign worker | Yes (owner) |
| PUT  | `/api/jobs/:id/complete` | Mark complete | Yes (owner) |
| GET  | `/api/jobs/my/posted` | Owner's jobs | Yes (owner) |
| GET  | `/api/jobs/my/applied` | Worker's applications | Yes (worker) |

### Reviews
| Method | URL | What it does | Auth needed? |
|---|---|---|---|
| POST | `/api/reviews` | Submit review for worker | Yes (owner) |
| GET  | `/api/reviews/worker/:id` | Worker's reviews | No |

---

## 🔑 HOW JWT AUTHENTICATION WORKS

1. User registers/logs in → backend returns a **JWT token**
2. Frontend stores token in `localStorage`
3. Every protected API call sends: `Authorization: Bearer <token>`
4. Backend verifies token → allows or blocks the request

This is all handled automatically by `AuthContext.js` in the frontend.

---

## 💰 COST BREAKDOWN (ZERO INVESTMENT)

| Service | What you get free | Limits |
|---|---|---|
| MongoDB Atlas | 512MB database | Enough for 100,000+ users |
| Render.com | 1 backend web service | Sleeps after 15min inactivity (free tier) |
| Vercel | Frontend hosting | Unlimited deployments |
| GitHub | Code hosting | Unlimited public repos |
| **Total** | **₹0 / month** | — |

### When to upgrade (only if you grow big):
- Render paid plan: $7/month (no sleep, faster)
- MongoDB Atlas M2: $9/month (2GB storage)
- Domain name: ~₹800/year for `nirmansetu.in`

---

## 🗺️ FUTURE FEATURES TO BUILD NEXT

### Phase 2 (next 3 months)
- [ ] Mobile OTP login (use MSG91 — free 100 OTPs/month)
- [ ] WhatsApp job alerts (Meta WhatsApp Business API — free tier)
- [ ] ₹1 payment integration (Razorpay — free to integrate, 2% per transaction)
- [ ] Hindi language toggle

### Phase 3 (months 4-6)
- [ ] Android app (use React Native — same JS code)
- [ ] Aadhaar verification (via DigiLocker API — free for startups)
- [ ] Admin panel to manage users and verify workers
- [ ] Email/SMS notifications

### Phase 4 (scale)
- [ ] Government tender integration
- [ ] Worker insurance tie-up
- [ ] Payroll & attendance for contractors
- [ ] Analytics dashboard

---

## ❓ COMMON ERRORS & FIXES

### "Cannot connect to MongoDB"
→ Check your `MONGO_URI` in `.env` — make sure username/password are correct
→ In MongoDB Atlas, go to Network Access → Add IP → Allow 0.0.0.0/0

### "Port 5000 already in use"
→ Change `PORT=5001` in your `.env`

### Frontend shows blank/no workers
→ Make sure backend is running on port 5000
→ Check browser console (F12) for errors
→ Make sure you ran `node seed.js`

### "CORS error" in browser
→ Check `FRONTEND_URL` in backend `.env` matches exactly where your frontend runs

### npm install fails
→ Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

---

## 📞 SUPPORT

- Email: hello@nirmansetu.in
- Helpline: 1800-XXX-XXXX
- GitHub Issues: github.com/yourusername/nirmansetu/issues

---

**Built with ❤️ for Bharat — NirmanSetu © 2025**
