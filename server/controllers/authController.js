const { v4: uuidv4 } = require("uuid");
const { oauth2client } = require("../config/googleConfig");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
require("dotenv").config();

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;

    //finding if user is in database
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        patientId: uuidv4(),
        name,
        email,
        image: picture,
        password: null,
      });
    } else if (!user.patientId) {
      user.patientId = uuidv4();
      await user.save();
    }

    //signing the jwt token with jwt secret.
    const token = jwt.sign(
      { _id: user._id, email: user.email, patientId: user.patientId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TIMEOUT,
      }
    );
    //sending the user info extracted from google
    return res.status(200).json({
      message: "Success",
      token,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        patientId: user.patientId, // optional if you want to show it in profile
      },
    });
  } catch (error) {
    console.error("Google login error: ", err);
    res.status(500).json({
      message: "Internal server error while logging in through google",
    });
  }
};

//Manual login
const manualLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not registered",
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email-id or password",
      });
    }

    //if password also correct, user authenticated, then generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, patientId: user.patientId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );

    //returning token and user info
    const { name, email: authEmail } = user;
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        patientId: user.patientId, // optional if you want to show it in profile
      },
    });
  } catch (error) {
    console.error("Manual login error", error);
    return res.status(500).json({
      message: "Internal server error during manual login.",
    });
  }
};

//signup

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  //function for extracting user name from email
  const extractName = (email) => {
    const base = email.split("@")[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
  };

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please log in to continue.",
      });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //extracting name
    const name = extractName(email);
    const newUser = await UserModel.create({
      patientId: uuidv4(),
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: { email: newUser.email, name: newUser.name || name },
    });
  } catch (error) {
    console.error("Error occured while sign up: ", error);
    return res.status(500).json({
      message: "Internal server error during signup",
    });
  }
};

module.exports = {
  googleLogin,
  manualLogin,
  signupUser,
};
