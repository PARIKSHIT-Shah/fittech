# FITTECH 4D — MERN Stack Fitness Webapp

A cyberpunk-styled fitness tracker with biometric profiling, BMI analysis,
calorie targets, and a MongoDB-backed task/todo system.

---

## 📁 Folder Structure

```
fittech-4d/
├── .env                        ← 🔑 PUT YOUR MONGODB URI HERE
├── package.json                ← root (runs both server + client)
│
├── server/
│   ├── index.js                ← Express entry point
│   ├── package.json
│   ├── models/
│   │   ├── User.js             ← Mongoose User schema
│   │   └── Task.js             ← Mongoose Task schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   └── tasks.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   └── tasksController.js
│   └── middleware/
│       └── auth.js             ← JWT protect middleware
│
└── client/
    ├── vite.config.js          ← proxies /api → localhost:5000
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx             ← React Router setup
        ├── index.css           ← Global cyberpunk styles
        ├── api/
        │   └── axios.js        ← Axios instance with JWT headers
        ├── hooks/
        │   ├── useAuth.jsx     ← Auth context (login/register/logout)
        │   └── useTasks.js     ← Task CRUD hooks
        ├── components/
        │   ├── Layout.jsx      ← Header + nav shell
        │   └── ProgressRing.jsx
        └── pages/
            ├── AuthPage.jsx    ← Login / Register
            ├── Onboarding.jsx  ← 4-step profile setup
            ├── Dashboard.jsx   ← BMI, calories, macros
            ├── Tasks.jsx       ← Fitness todo list
            └── Profile.jsx     ← Edit & save profile
```

---

## 🚀 Quick Start

### 1. Add your MongoDB URI

Open `.env` in the root folder and replace the placeholder:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fittech4d?retryWrites=true&w=majority
```

> Get your URI from [MongoDB Atlas](https://cloud.mongodb.com) →  
> Cluster → Connect → Connect your application → copy the string.

---

### 2. Install dependencies

```bash
# From the root folder
npm run install:all
```

This installs packages for root, server, and client in one shot.

---

### 3. Run in development

```bash
npm run dev
```

This starts:
- **Express server** on `http://localhost:5000`
- **React (Vite)** on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| POST   | /api/auth/register  | —    | Create account       |
| POST   | /api/auth/login     | —    | Login, get JWT       |
| GET    | /api/auth/me        | ✅   | Get current user     |
| GET    | /api/profile        | ✅   | Get biometric profile|
| PUT    | /api/profile        | ✅   | Update profile       |
| GET    | /api/tasks          | ✅   | Get all tasks        |
| POST   | /api/tasks          | ✅   | Create task          |
| PUT    | /api/tasks/:id      | ✅   | Update/toggle task   |
| DELETE | /api/tasks/:id      | ✅   | Delete task          |

---

## 🏗 Production Build

```bash
npm run build          # builds React into client/dist/
NODE_ENV=production npm run server  # serves both from Express on port 5000
```

---

## 🛠 Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Database | MongoDB + Mongoose                |
| Backend  | Node.js + Express + JWT + bcrypt  |
| Frontend | React 18 + Vite + React Router v6 |
| HTTP     | Axios (with interceptors)         |
| Fonts    | Orbitron · Rajdhani · Share Tech Mono |
