const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  createAccount: {
    type: Date,
    default: Date.now, // Store the date when the account was created
  },
  email: { 
    type: String, 
    required: true,
     unique: true 
    },
  password: { 
    type: String, 
    required: true
   },
   confirmedPassword: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema, "primeMarket");

module.exports = User;
