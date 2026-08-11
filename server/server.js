const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables (no-op on Render since .env is gitignored,
// but Render injects env vars from dashboard automatically)
dotenv.config();

// ─── CORS Configuration ───────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ─── App Setup ────────────────────────────────────────────────
const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth',          require('./src/routes/authRoutes'));
app.use('/api/complaints',    require('./src/routes/complaintRoutes'));
app.use('/api/admin',         require('./src/routes/adminRoutes'));
app.use('/api/officer',       require('./src/routes/officerRoutes'));
app.use('/api/comments',      require('./src/routes/commentRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    message: 'NagarSetu API is running',
    environment: process.env.NODE_ENV || 'not set',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    hasMongoURI: !!process.env.MONGO_URI,
    
    hasJWTSecret: !!process.env.JWT_SECRET,
    hasClientOrigin: !!process.env.CLIENT_ORIGIN,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
  });
});

// ─── Start Server ─────────────────────────────────────────────
// CRITICAL: Bind to PORT immediately so Render doesn't kill the process.
// DB connection happens AFTER the server is already listening.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 NagarSetu Server running on port ' + PORT);

  // Check env vars (warn only, don't exit)
  if (!process.env.MONGO_URI) {
    console.error('⚠ MONGO_URI is not set! Set it in Render dashboard → Environment');
  }
  if (!process.env.JWT_SECRET) {
    console.error('⚠ JWT_SECRET is not set! Set it in Render dashboard → Environment');
  }

  // Connect to MongoDB (non-blocking, won't crash the server)
  if (process.env.MONGO_URI) {
    const connectDB = require('./src/config/db');
    const seedDepartments = require('./src/config/seedDepartments');
    connectDB()
      .then(() => seedDepartments())
      .catch((err) => console.error('MongoDB setup error:', err.message));
  }
});

// In production, serve the built React app from the client/dist folder
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}
