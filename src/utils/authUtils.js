const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

// Retrieve the secret key from the environment variable
const secretKey = process.env.SECRET_KEY;

// Generate a JWT token
exports.generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

// Verify a JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null; // Token verification failed
  }
};
