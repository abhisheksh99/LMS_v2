import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }
  
    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        message: "User already exists.",
        success: false,
      });
    }
  
    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
  
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
  
    await newUser.save();
  
    // Respond with success message and token
    generateToken(res, newUser, `Registration successful. Please log in.`);
   
  });

  // Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }
  
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }
  
    // Check if password matches
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }
  
    // Generate token and send response
    generateToken(res, user, `Welcome back ${user.name}`);
  });
  
  // Logout User
  export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  });