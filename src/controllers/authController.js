require("../models/database");
const User = require("../models/User");
const argon2 = require("argon2");
const { generateAccessToken } = require('../utils/authUtils');
const { generateRefreshToken } = require('../utils/authUtils');



// Controller for user sign-in
exports.signupUser = async (req, res) => {
  try {
    const { email, password, confirmedPassword } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate the confirmed password field
    if (password !== confirmedPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
      
    }

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ success: true, data: user, message: 'User registration successful' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message, message: 'User registration failed' });
  }

}

exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by name
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email!' });
    }

    // Compare the password using Argon2
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password, Provide the correct Password!' });
    }

    // Generate the access token and refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send both tokens in the response
    res.status(200).json({ success: true, accessToken, refreshToken, message:"Login Successful" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// Controller for user logout
exports.logoutUser = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully! Thank You for using our Application' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
    
};