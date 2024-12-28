import asyncHandler from "express-async-handler";
import Course from "../models/courseModel.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;

  if (!courseTitle || !category) {
    return res.status(400).json({
      message: "Course title and category are required",
      success: false,
    });
  }

  const newCourse = await Course.create({
    courseTitle,
    category,
    creator: req.id,
  });
  
  res.status(201).json({
    message: "Course created successfully",
    success: true,
    course: newCourse,
  });
});

export const getCreatorCourses = asyncHandler(async(req,res)=>{
  const userId = req.id;
  const courses = await Course.find({creator:userId});
  
  if(!courses || courses.length === 0){
    return res.status(404).json({
      message: "No courses found for this creator",
      success: false
    });
  }

  res.status(200).json({
    message: "Courses retrieved successfully",
    success: true,
    courses
  });
});

export const editCourse = asyncHandler(async(req, res)=> {
  const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
  const thumbnail = req.file;
  const courseId = req.params.courseId;

  // Find the course by ID
  let course = await Course.findById(courseId);
  
  if (!course) {
    return res.status(404).json({ message: "Course not found!", success: false });
  }

  let courseThumbnail;

  // Handle thumbnail upload if provided
  if (thumbnail) {
    // Delete old image if it exists
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId); // Delete old image from Cloudinary
    }
    
    // Upload new thumbnail to Cloudinary
    courseThumbnail = await uploadMedia(thumbnail.path);
  }

  // Prepare update data
  const updateData = {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
    ...(courseThumbnail && { courseThumbnail: courseThumbnail.secure_url }) // Include new thumbnail URL if uploaded
  };

  // Update the course in the database
  course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

  res.status(200).json({
    message: "Course updated successfully.",
    success: true,
    course
  });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Validate courseId
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "Course ID is required.",
    });
  }

  // Find course by ID
  const course = await Course.findById(courseId);

  // Check if course exists
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  // Send the course data with a success message
  res.status(200).json({
    success: true,
    message: "Course retrieved successfully.",
    course,
  });
});

export const togglePublish = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { publish } = req.query; // "true" or "false"

  // Check if publish query parameter is provided
  if (!publish) {
    return res.status(400).json({
      success: false,
      message: "Publish query parameter is required.",
    });
  }

  // Find the course by ID
  const course = await Course.findById(courseId);

  // Check if the course exists
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  // Update publish status based on query parameter
  course.isPublished = publish === "true";
  await course.save();

  const statusMessage = course.isPublished
    ? "Course is Published"
    : "Course not Published";

  // Send response with status message
  res.status(200).json({
    success: true,
    message: statusMessage,
  });
});

export const removeCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Validate courseId
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing course ID.",
    });
  }

  // Find the course by ID
  const course = await Course.findById(courseId);

  // Check if course exists
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  // Delete the course
  await Course.findByIdAndDelete(courseId);

  // Send success response
  res.status(200).json({
    success: true,
    message: "Course deleted successfully.",
  });
});
