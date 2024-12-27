import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload media to Cloudinary
export const uploadMedia = async (file) => {
  try {
    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Automatically detect the type of media (image, video, etc.)
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
