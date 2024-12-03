const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure you're using the updated User model

// Login function to authenticate the user and return a JWT token
const login = async (req, res) => {
  const { f_userName, f_Pwd } = req.body; // Expecting these fields from the client

  // Log the incoming request data for debugging
  console.log('Received login request:', req.body);

  // Check if the required fields are present
  if (!f_userName || !f_Pwd) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Find the user by f_userName
    const user = await User.findOne({ f_userName });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd); // Compare the passwords
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, f_userName: user.f_userName }, // Payload contains userId and username
      process.env.JWT_SECRET, // Use the secret for signing the token
      { expiresIn: "1h" } // Set an expiration time (optional)
    );

    // Send the token in the response
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
