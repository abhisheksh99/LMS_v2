import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

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

export const getUserProfileById = asyncHandler(async (req, res) => {
  const id = req.id;
  const user = await User.findById(id).select("-password");
  
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
      success: false,
    });
  }
  // Respond with user profile information
  res.status(200).json({
    message: "User profile retrieved successfully.",
    success: true,
    user,
  });
});

export const updateUserProfileById = asyncHandler(async(req,res)=>{
  const id = req.id;
  const {name} = req.body;
  const profilePhoto = req.file;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

    // Extract publicId of old image from URL if exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId); // Await added for async function
    }

      // Upload new photo
  const cloudResponse = await uploadMedia(profilePhoto.path);
  const photoUrl = cloudResponse.secure_url;

  const updatedData = { name, photoUrl };
  const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
  }).select("-password");

  // Respond with updated user information
  res.status(200).json({
    message: "User profile updated successfully.",
    success: true,
    user: updatedUser,
  });

  

})
