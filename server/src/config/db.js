const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of hanging forever
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log clearly — don't call process.exit() here so the HTTP server keeps running
    // and Render can see the error in logs without marking it as crashed immediately
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error('   Check MONGO_URI in your Render environment variables.');
    throw error; // bubble up to caller
  }
};

module.exports = connectDB;
