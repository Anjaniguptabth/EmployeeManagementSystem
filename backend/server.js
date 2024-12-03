const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./db'); // Import the DB connection
const User = require('./models/user'); // Import the updated User model
const employeeRoutes = require('./routes/employeeRoutes'); // Import employee routes
const authRoutes = require('./routes/authRoutes'); // Import auth routes
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes for authentication and employee management
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Function to create the default user if it doesn't exist
async function createDefaultUser() {
  try {
    const defaultUser = {
      f_userName: 'admin', // Use f_userName as per your schema
      f_Pwd: 'adminPassword123', // Plain-text password here (will be hashed)
    };

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ f_userName: defaultUser.f_userName });

    if (!existingUser) {
      // If the user doesn't exist, hash the password and create a new user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultUser.f_Pwd, salt);

      // Get the next serial number (you can adjust this logic as per your requirements)
      const latestUser = await User.findOne().sort({ f_sno: -1 });
      const newSerialNumber = latestUser ? latestUser.f_sno + 1 : 1;

      const newUser = new User({
        f_sno: newSerialNumber,  // Set the serial number
        f_userName: defaultUser.f_userName,
        f_Pwd: hashedPassword,  // Store the hashed password
      });

      // Save the user to the database
      await newUser.save();
      console.log('Default user created!');
    } else {
      console.log('Default user already exists!');
    }
  } catch (err) {
    console.error('Error creating default user:', err.message);
  }
}

// Connect to MongoDB and then start the server
connectDB().then(() => {
  // Once connected to the database, create the default user
  createDefaultUser();

  // Start the Express server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection error:', err.message);
});
