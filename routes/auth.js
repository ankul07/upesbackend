const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const info = await User.findOne({ email });

    if (!info) {
      return res.status(404).json("User not found!");
    }
    const match = await bcrypt.compare(password, info.password);

    if (!match) {
      return res.status(401).json("Wrong credentials!");
    }

    sendToken(info, 200, res);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGOUT
router.get("/logout", async (req, res) => {
  try {
    const options = {
      expires: new Date(Date.now()), // Token expiration time (e.g., 90 days)
      httpOnly: true, // Ensures that the cookie is only accessible via HTTP(S) and not JavaScript
      secure: true,
      sameSite: "none",
    };
    res
      .status(200)
      .cookie("token", null, options)
      .send("User logged out successfully!");
    // res
    //   .clearCookie("token", options)
    //   .status(200)
    //   .send("User logged out successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//REFETCH USER
// router.get("/refetch", (req, res) => {
//   const token = req.cookies.token;
//   jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
//     if (err) {
//       return res.status(404).json(err);
//     }

//     res.status(200).json(data);
//     console.log(data);
//   });
// });
router.get("/refetch", async (req, res) => {
  try {
    const { token } = req.cookies;

    // Verify the token using the secret
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(decodedToken);

    if (!decodedToken) {
      throw new Error("Token not valid");
    }
    const userId = decodedToken.id;

    // Fetch the user from the database based on the userId
    const data = await User.findById(userId);

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error:", err); // Log any errors
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
