# NagarSetu — Smart Civic Issue Reporting Platform

**NagarSetu** (नगरसेतु — "City Bridge") is a full-stack web application that makes it simple for citizens to report civic issues like potholes, broken street lights, or overflowing drains — and actually get them resolved. It connects citizens directly with municipal administrators and department officers through a transparent, trackable workflow.

Built with the MERN stack. Deployed on Vercel + Render.

---

## Why We Built This

We've all been there. You spot a massive pothole on your daily commute, a street light that's been dead for weeks, or garbage piling up in your neighborhood. You want to report it, but you don't know who to call, which department handles it, or whether anyone will actually do something about it.

NagarSetu solves this. Citizens report issues through a simple form (with photos and map location), admins verify and route them to the right department, and officers update progress until the issue is fixed. Every step is visible, every update is notified, and nothing falls through the cracks.

---

## What It Does

The platform has three user roles, each with their own dashboard:

### Citizens
- Report civic issues with a title, description, category, priority, photos, and an exact location pinned on an interactive map
- Track complaints through every stage — submitted, verified, assigned, in progress, resolved
- Get notified whenever something changes
- Upvote other citizens' complaints to help prioritize urgent issues
- Rate the resolution once it's done (1–5 stars)

### Administrators
- Review and verify incoming complaints
- Assign verified complaints to the right department officer
- View analytics — category breakdowns, status distributions, complaint trends
- Manage officers and departments

### Department Officers
- See all complaints assigned to them
- Mark complaints as "in progress" with notes
- Resolve complaints — citizens get notified automatically
- Track personal stats (assigned, in progress, resolved, closed)

---

## How a Complaint Moves Through the System

```
Citizen reports issue
        |
        v
Admin reviews & verifies
        |
        v
Admin assigns to department officer
        |
        v
Officer starts work (status: in_progress)
        |
        v
Officer resolves the issue
        |
        v
Citizen gets notified, rates the resolution
        |
        v
Complaint closed
```

**Status flow:** `submitted` → `verified` → `assigned` → `in_progress` → `resolved` → `closed`

---

## Tech Stack

**Frontend:** React 19, Vite 8, React Router 7, Axios, React-Leaflet (maps), Bootstrap, Lucide icons, React-Toastify

**Backend:** Node.js, Express 5, Mongoose 9, JWT authentication, bcryptjs for password hashing

**Database:** MongoDB Atlas

**Deployment:** Vercel (frontend), Render (backend)

---

## Project Structure

```
nagarsetu/
|
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components (by feature area)
│   │   ├── context/AuthContext.jsx # Global auth state
│   │   ├── pages/                 # Page components grouped by role
│   │   │   ├── Admin/             # Dashboard, VerifyIssues, AssignOfficers
│   │   │   ├── Auth/              # Login, Signup
│   │   │   ├── Citizen/           # Dashboard, ReportIssue, MyComplaints, Details
│   │   │   ├── LandingPage/       # Public landing page
│   │   │   └── Officer/           # Dashboard, OfficerWork
│   │   ├── routes/PrivateRoute.jsx # Role-based route guards
│   │   └── services/api.js        # Centralized Axios client
│   └── .env.example
|
├── server/                        # Node.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── seedDepartments.js # Seeds 6 departments + admin user on first run
│   │   ├── controllers/           # Business logic for each route group
│   │   ├── middleware/auth.js     # JWT verification + role authorization
│   │   ├── models/                # Mongoose schemas (User, Complaint, Department, Comment, Notification)
│   │   └── routes/                # Express route definitions
│   ├── server.js                  # App entry point
│   └── .env.example
|
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+ and npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works fine)
- Git

### 1. Clone and install

```bash
git clone https://github.com/Adi-Marathe/Nagarsetu.git
cd Nagarsetu
```

Install dependencies for both client and server:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**Server** — copy `server/.env.example` to `server/.env` and fill in:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/nagarsetu?retryWrites=true&w=majority
JWT_SECRET=your_secret_here        # generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the app

You'll need two terminal windows:

```bash
# Terminal 1 — start the backend
cd server
npm run dev
```

```bash
# Terminal 2 — start the frontend
cd client
npm run dev
```

The app will be running at `http://localhost:5173`.

On the first startup, the server automatically seeds 6 municipal departments and a default admin account.

### 4. Default admin credentials

| Email | Password |
|---|---|
| `admin@nagarsetu.local` | `Admin@123` |

Change these in production by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

---

## API Endpoints

All routes are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/profile` | Authenticated | Get current user |
| PUT | `/auth/profile` | Authenticated | Update profile |

### Complaints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/complaints` | Citizen | Create a complaint |
| GET | `/complaints` | Authenticated | Get complaints (filtered by role) |
| GET | `/complaints/all` | Admin | Get all complaints |
| GET | `/complaints/:id` | Authenticated | Get complaint details |
| PUT | `/complaints/:id/status` | Admin, Officer | Update status |
| PUT | `/complaints/:id/upvote` | Authenticated | Toggle upvote |
| PUT | `/complaints/:id/feedback` | Citizen | Rate a resolved complaint |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Dashboard statistics |
| PUT | `/admin/verify/:id` | Admin | Verify a complaint |
| PUT | `/admin/assign/:id` | Admin | Assign to an officer |
| GET | `/admin/officers` | Admin | List all officers |
| GET | `/admin/departments` | Admin | List all departments |

### Officer
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/officer/complaints` | Officer | Get assigned complaints |
| GET | `/officer/stats` | Officer | Personal stats |
| PUT | `/officer/progress/:id` | Officer | Mark as in progress |
| PUT | `/officer/resolve/:id` | Officer | Resolve complaint |

### Comments and Notifications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/comments/:complaintId` | Authenticated | Add a comment |
| GET | `/comments/:complaintId` | Authenticated | Get comments |
| GET | `/notifications` | Authenticated | Get notifications |
| PUT | `/notifications/:id/read` | Authenticated | Mark as read |
| PUT | `/notifications/read-all` | Authenticated | Mark all as read |

---

## Database Models

**User** — name, email, hashed password, role (`citizen`/`admin`/`officer`), phone, department reference

**Complaint** — title, description, category (19 types), status (6 stages), priority, location (address + lat/lng), images, citizen ref, department ref, assigned officer, upvotes array, timeline (audit trail of every status change), feedback (rating + comment), resolved timestamp

**Department** — name, code, description, associated categories, department head, contact info. Six departments are seeded automatically: Public Works (PWD), Sanitation (SAN), Water Supply (WSD), Electricity (ELEC), Health (HEALTH), Transport (TRANS)

**Comment** — linked to a complaint and user, text content with timestamps

**Notification** — linked to a user, with title, message, type (status_update, assignment, comment, etc.), read status, and optional complaint reference

---

## Deployment

### Frontend on Vercel

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set root directory to `client`
3. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Backend on Render

1. Create a new Web Service on [render.com](https://render.com)
2. Set root directory to `server`
3. Build command: `npm install` | Start command: `npm start`
4. Add env variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production`
5. Deploy

---

## Security

- Passwords are hashed with bcrypt (10 salt rounds) and excluded from query results by default
- JWT tokens with 30-day expiry, verified on every protected route
- Role-based middleware — `protect` checks the token, `authorize` checks the role
- CORS whitelist — only configured origins can hit the API
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`
- Mongoose schema validation with custom error messages on all inputs

---

## What's Next

Some features we're planning to add:

- Real-time notifications with WebSocket
- Email and SMS alerts for status changes
- Heatmap visualization for complaint density across the city
- Department performance metrics and leaderboards
- Complaint escalation for overdue issues
- Multi-language support (Hindi, Marathi, etc.)
- Progressive Web App support for mobile

---

## Contributing

If you'd like to contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

MIT License — use it, modify it, build on it.

---

*Built for Smart India. Because every pothole reported is a step toward a better city.*
