const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket inactivity
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
