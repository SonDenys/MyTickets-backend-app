//Import package
const mongoose = require("mongoose");

// Creation model
const User = mongoose.model("User", {
  email: {
    unique: true,
    required: true,
    type: String,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
