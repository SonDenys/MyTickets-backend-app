const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Import models
const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    // Check if the email doesn't already exist in the database
    const user = await User.findOne({ email: req.fields.email });
    if (!user) {
      // if it doesn't exist => suscription
      // Encrypt the password
      const salt = uid2(16);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);

      // Create a new user
      const newUser = new User({
        email: req.fields.email,
        token: token,
        hash: hash,
        salt: salt,
      });

      await newUser.save();

      // Answer to the client
      res.status(200).json({
        id: newUser._id,
        email: newUser.email,
        account: newUser.account,
        token: newUser.token,
      });
    } else {
      res.status(409).json({ message: "This email already has an account" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    // Check the user who wants to connect
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      // Create a new hash with the password
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );

      // If the hash of the database and the new hash are equals ==> connexion OK
      if (newHash === user.hash) {
        res.status(200).json({
          email: user.email,
          account: user.account,
          token: user.token,
          id: user._id,
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
    // If not ==> Unauthorized
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
