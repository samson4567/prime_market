require("../models/database");
const User = require("../models/user");
const tokenUtils = require("../utils/authUtils");
const argon2 = require("argon2");

// Controller for user signup
exports.signupUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await argon2.hash(password);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Error while signing up:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while signing up" });
  }
};

// Controller for user sign-in
exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both email and password are required" });
    }

    // Check if a user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Verify the password
    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate a JWT token
    const token = tokenUtils.generateToken(
      { userId: user._id, email: user.email },
      "1h"
    );

    // Return the token and a success message
    return res.status(200).json({ message: "Sign-in successful", token });
  } catch (err) {
    console.error("Error while signing in:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while signing in" });
  }
};


// Controller for user logout
exports.logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};