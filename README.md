<p align="center">
  <img src="https://img.shields.io/badge/NagarSetu-Smart%20Civic%20Platform-0D9488?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTMgMjFoMTgiLz48cGF0aCBkPSJNNSAyMVYxMWw3LTcgNyA3djEwIi8+PHBhdGggZD0iTTkgMjFWMTRoNnY3Ii8+PC9zdmc+" alt="NagarSetu Badge"/>
</p>

<h1 align="center">🏛️ NagarSetu</h1>
<h3 align="center">Smart Civic Issue Reporting & Resolution Platform</h3>

<p align="center">
  <em>Bridging the gap between citizens and local governance — one complaint at a time.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet&logoColor=white" alt="Leaflet"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
</p>

---

## 🤔 The Problem

Every day, citizens across India face civic issues — potholes that damage vehicles, broken street lights that make neighborhoods unsafe, overflowing drains during monsoon season. Most people either don't know *who* to report these issues to, or give up after being sent from one department to another with no resolution in sight.

**NagarSetu** was born out of a simple question: *What if reporting a civic issue was as easy as posting on social media?*

## 💡 What is NagarSetu?

**NagarSetu** (नगरसेतु — literally "City Bridge" in Hindi) is a full-stack web platform that creates a digital bridge between citizens and municipal authorities. It provides a structured, transparent workflow where:

- **Citizens** report issues with photos, descriptions, and pinned map locations
- **Administrators** verify, prioritize, and route complaints to the right department
- **Department Officers** take action, update progress, and resolve issues

Every step is tracked, every update is notified, and every resolution is accountable.

---

## ✨ Key Features

### 👤 For Citizens
| Feature | Description |
|---|---|
| **Report Issues** | Submit complaints with title, description, category, priority, photos, and exact GPS location via an interactive map |
| **Track Progress** | Follow your complaint through every stage — from submission to resolution — with a detailed timeline |
| **Get Notified** | Receive in-app notifications at every milestone (verified, assigned, in-progress, resolved) |
| **Upvote Issues** | Support issues reported by others to help the community prioritize what matters most |
| **Give Feedback** | Rate the resolution and close the loop with a 1–5 star rating |

### 🛡️ For Administrators
| Feature | Description |
|---|---|
| **Verify Complaints** | Review and validate submitted complaints before they enter the resolution pipeline |
| **Assign to Officers** | Route complaints to specific department officers with a single action |
| **Dashboard Analytics** | View category-wise breakdowns, status distributions, and recent complaint trends |
| **Manage Users** | See all registered officers and departments at a glance |

### 👨‍💼 For Department Officers
| Feature | Description |
|---|---|
| **View Assignments** | See all complaints assigned to you, filtered by status |
| **Update Progress** | Mark complaints as "in progress" with notes to keep citizens informed |
| **Resolve Issues** | Close out complaints once work is done — the citizen is notified automatically |
| **Personal Stats** | Track your own resolution stats: assigned, in-progress, resolved, closed |

---

## 🔄 How a Complaint Moves Through the System

```
  ┌─────────────────┐
  │  Citizen Reports │
  │   a Civic Issue  │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │  Admin Reviews   │
  │  & Verifies It   │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │  Admin Assigns   │
  │  to Department   │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Officer Starts   │
  │    Work on It    │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Officer Resolves │
  │   the Issue      │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Citizen Gets     │
  │ Notified & Rates │
  └─────────────────┘
```

**Statuses:** `submitted` → `verified` → `assigned` → `in_progress` → `resolved` → `closed`

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT  (React + Vite)                   │
│                                                              │
│   Landing Page ─── Auth Pages ─── Role-Based Dashboards      │
│       │                │                   │                 │
│       │                │         ┌─────────┼──────────┐      │
│       │                │         │         │          │      │
│       │                │      Citizen    Admin     Officer   │
│       │                │      Portal   Dashboard  Dashboard  │
│       │                │                                     │
│       └────────────────┴──── Axios API Layer (api.js) ──────┤
└──────────────────────────────────┬───────────────────────────┘
                                   │ HTTP (REST)
                                   ▼
┌──────────────────────────────────────────────────────────────┐
│                  SERVER  (Node.js + Express 5)               │
│                                                              │
│   CORS ─── JSON Parser ─── Security Headers                 │
│       │                                                      │
│   ┌───┴──────────────────────────────────────────────┐       │
│   │              JWT Auth Middleware                  │       │
│   │         (protect + role-based authorize)         │       │
│   └──────────────────────┬───────────────────────────┘       │
│                          │                                   │
│   Routes: /auth  /complaints  /admin  /officer  /comments   │
│           /notifications  /health                            │
│                          │                                   │
│   Controllers ─── Models ─── Mongoose ODM                    │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    MongoDB Atlas       │
              │  (Cloud Database)      │
              └────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI |
| **Vite 8** | Lightning-fast dev server & build tool |
| **React Router 7** | Client-side routing with role-based guards |
| **Axios** | HTTP client with interceptors for auth tokens |
| **React-Leaflet** | Interactive maps for location pinning |
| **Lucide React** & **React Icons** | Modern icon libraries |
| **React-Bootstrap 2** | UI component framework |
| **React-Toastify** | Toast notifications for user feedback |
| **Lottie** | Animated illustrations |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework with async error handling |
| **Mongoose 9** | MongoDB object modeling |
| **JWT** | Stateless authentication (30-day tokens) |
| **bcryptjs** | Password hashing (10 salt rounds) |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **5 Collections** | Users, Complaints, Departments, Comments, Notifications |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting with automatic deploys |
| **Render** | Backend hosting with environment variable support |

---

## 📂 Project Structure

```
nagarsetu/
│
├── client/                          # React Frontend
│   ├── public/                      # Static assets (favicon, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # Admin-specific components
│   │   │   ├── auth/                # Auth form fields
│   │   │   ├── landing/             # Landing page cards
│   │   │   ├── layout/              # Dashboard layout wrapper
│   │   │   ├── map/                 # Leaflet map picker
│   │   │   ├── officer/             # Officer work assignment rows
│   │   │   └── shared/              # Reusable components (StatCard, StatusBadge, etc.)
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state management
│   │   ├── pages/
│   │   │   ├── Admin/               # AdminDashboard, VerifyIssues, AssignOfficers
│   │   │   ├── Auth/                # Login, Signup
│   │   │   ├── Citizen/             # CitizenDashboard, ReportIssue, MyComplaints, ComplaintDetails
│   │   │   ├── LandingPage/         # Public landing page
│   │   │   └── Officer/             # OfficerDashboard, OfficerWork
│   │   ├── routes/
│   │   │   └── PrivateRoute.jsx     # Role-based route protection
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios API client
│   │   ├── App.jsx                  # Root component with routing
│   │   └── main.jsx                 # Entry point
│   ├── .env.example                 # Frontend env template
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection handler
│   │   │   └── seedDepartments.js   # Auto-seeds 6 departments + admin user
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, Login, Profile
│   │   │   ├── complaintController.js # CRUD + upvote + feedback
│   │   │   ├── adminController.js   # Stats, verify, assign
│   │   │   ├── officerController.js # Assigned complaints, progress, resolve
│   │   │   ├── commentController.js # Add & fetch comments
│   │   │   └── notificationController.js # Fetch & mark-as-read
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verification + role authorization
│   │   ├── models/
│   │   │   ├── User.js              # Users with roles (citizen/admin/officer)
│   │   │   ├── Complaint.js         # Complaints with timeline tracking
│   │   │   ├── Department.js        # Municipal departments
│   │   │   ├── Comment.js           # Complaint comments
│   │   │   └── Notification.js      # In-app notifications
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── complaintRoutes.js
│   │       ├── adminRoutes.js
│   │       ├── officerRoutes.js
│   │       ├── commentRoutes.js
│   │       └── notificationRoutes.js
│   ├── server.js                    # Express app entry point
│   ├── .env.example                 # Backend env template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Adi-Marathe/Nagarsetu.git
cd Nagarsetu
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file by copying the template:

```bash
cp .env.example .env
```

Fill in your values:

```env
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nagarsetu?retryWrites=true&w=majority

# JWT Secret — generate a strong one:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_super_secret_key_here

# Server port
PORT=5000

# Environment
NODE_ENV=development

# Allowed frontend origin
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Set Up the Frontend

```bash
cd ../client
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
> Server starts at `http://localhost:5000`
> Automatically seeds 6 departments + a default admin user on first run

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
> App opens at `http://localhost:5173`

### 5. Default Admin Login

On first startup, the system auto-creates an admin account:

| Field | Value |
|---|---|
| **Email** | `admin@nagarsetu.local` |
| **Password** | `Admin@123` |

> ⚠️ **Change this immediately in production** by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` in the `Authorization` header.

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `GET` | `/auth/profile` | Authenticated | Get current user profile |
| `PUT` | `/auth/profile` | Authenticated | Update profile details |

### Complaints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/complaints` | Citizen | Create a new complaint |
| `GET` | `/complaints` | Authenticated | Get complaints (role-filtered) |
| `GET` | `/complaints/all` | Admin | Get all complaints unfiltered |
| `GET` | `/complaints/:id` | Authenticated | Get complaint details |
| `PUT` | `/complaints/:id/status` | Admin, Officer | Update complaint status |
| `PUT` | `/complaints/:id/upvote` | Authenticated | Toggle upvote |
| `PUT` | `/complaints/:id/feedback` | Citizen | Rate a resolved complaint |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | Admin | Dashboard statistics |
| `PUT` | `/admin/verify/:id` | Admin | Verify a complaint |
| `PUT` | `/admin/assign/:id` | Admin | Assign complaint to officer |
| `GET` | `/admin/officers` | Admin | List all officers |
| `GET` | `/admin/departments` | Admin | List all departments |

### Officer
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/officer/complaints` | Officer | Get assigned complaints |
| `GET` | `/officer/stats` | Officer | Personal resolution stats |
| `PUT` | `/officer/progress/:id` | Officer | Start work on complaint |
| `PUT` | `/officer/resolve/:id` | Officer | Mark complaint as resolved |

### Comments & Notifications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/comments/:complaintId` | Authenticated | Add a comment |
| `GET` | `/comments/:complaintId` | Authenticated | Get all comments |
| `GET` | `/notifications` | Authenticated | Get user notifications |
| `PUT` | `/notifications/:id/read` | Authenticated | Mark notification as read |
| `PUT` | `/notifications/read-all` | Authenticated | Mark all as read |

### Health Check
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | API & database status |

---

## 🗄️ Database Schema

### User
```javascript
{
  name: String,          // min 3 chars
  email: String,         // unique, lowercase
  password: String,      // hashed with bcrypt, min 6 chars
  role: 'citizen' | 'admin' | 'officer',
  phone: String,
  department: ObjectId,  // ref: Department (for officers)
  avatar: String
}
```

### Complaint
```javascript
{
  title: String,           // max 200 chars
  description: String,     // max 2000 chars
  category: String,        // 19 predefined categories
  status: 'submitted' | 'verified' | 'assigned' | 'in_progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high' | 'critical',
  location: { address, lat, lng },
  images: [String],        // base64 encoded
  citizen: ObjectId,       // who reported it
  department: ObjectId,    // auto-assigned by category
  assignedOfficer: ObjectId,
  upvotes: [ObjectId],     // users who upvoted
  timeline: [{             // full audit trail
    status, message, updatedBy, timestamp
  }],
  feedback: { rating: 1-5, comment },
  resolvedAt: Date
}
```

### Department (Auto-Seeded)
| Code | Department | Handles |
|---|---|---|
| **PWD** | Public Works Department | Road Damage, Pothole, Bridge Issue |
| **SAN** | Sanitation Department | Garbage, Drainage, Sewage, Sanitation |
| **WSD** | Water Supply Department | Water Leakage, Pipeline Burst, Water Supply |
| **ELEC** | Electricity Department | Street Light, Power Outage, Electricity Fault |
| **HEALTH** | Health Department | Hospital, Medical Emergency |
| **TRANS** | Transport Department | Traffic, Parking, Public Transport |

---

## 🌐 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Set **Root Directory** to `client`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy 🚀

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_ORIGIN=https://your-app.vercel.app
   NODE_ENV=production
   ```
7. Deploy 🚀

---

## 🔒 Security Features

- **Password Hashing** — bcrypt with 10 salt rounds
- **JWT Authentication** — 30-day token expiry, Bearer scheme
- **Role-Based Access Control** — `protect` + `authorize` middleware on every sensitive route
- **CORS Whitelist** — Only allowed origins can make API requests
- **Security Headers** — `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
- **Input Validation** — Mongoose schema validation with custom error messages
- **Password Protection** — Password field excluded from queries by default (`select: false`)

---

## 🎯 Skills & Concepts Demonstrated

- Full-stack **MERN** application development
- **Role-Based Access Control (RBAC)** with three distinct user roles
- RESTful API design with proper HTTP methods and status codes
- JWT-based **stateless authentication**
- MongoDB **data modeling** with references, embedded documents, and pre-save hooks
- **GIS integration** with Leaflet for location-based reporting
- React **Context API** for global state management
- **Client-side route guards** with role-based redirects
- Centralized **API service layer** with Axios interceptors
- **Auto-seeding** for departments and admin user on first run
- Cloud deployment across **Vercel** (frontend) and **Render** (backend)

---

## 🚧 Roadmap

- [ ] Real-time notifications via WebSocket
- [ ] Email & SMS alerts for status changes
- [ ] GIS heatmap for complaint density visualization
- [ ] Advanced analytics with resolution time metrics
- [ ] Department performance leaderboards
- [ ] Progressive Web App (PWA) support
- [ ] Multi-language support (Hindi, Marathi, etc.)
- [ ] Image compression before upload
- [ ] Complaint escalation system for overdue issues

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it, modify it, and build upon it.

---

<p align="center">
  <strong>Built with ❤️ for Smart India</strong><br/>
  <em>Because every pothole reported is a step toward a better city.</em>
</p>
