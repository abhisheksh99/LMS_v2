import asyncHandler from "express-async-handler";
import Course from "../models/courseModel.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import Lecture from "../models/lectureModel.js";

// Create a new course
export const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;

  // Validate input
  if (!courseTitle || !category) {
    return res.status(400).json({ message: "Course title and category are required", success: false });
  }

  const newCourse = await Course.create({
    courseTitle,
    category,
    creator: req.id 
  });

  res.status(201).json({
    message: "Course created successfully",
    success: true,
    course: newCourse
  });
});

// Get courses created by the user
export const getCreatorCourses = asyncHandler(async (req, res) => {
  const userId = req.id;
  
  const courses = await Course.find({ creator: userId });

  if (!courses || courses.length === 0) {
    return res.status(404).json({ message: "No courses found", success: false });
  }

  res.status(200).json({
    message: "Courses retrieved successfully",
    success: true,
    courses
  });
});

// Edit an existing course
export const editCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
  const thumbnail = req.file;

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

  // Delete all lectures associated with the course
  await Lecture.deleteMany({ courseId });

  // Delete the course
  const course = await Course.findByIdAndDelete(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Course and its lectures removed successfully.",
  });
});

export const getPublishedCourses = asyncHandler(async(req,res)=>{
    // Fetch all published courses
    const courses = await Course.find({ isPublished: true }).populate("creator", "name photoUrl");

    // Check if no courses were found
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found.",
      });
    }

    // Return the list of published courses
    res.status(200).json({
      success: true,
      courses

    });
    
    
})

export const searchCourse = asyncHandler(async (req, res) => {
  const { query = "", categories = [], sortByPrice = "" } = req.query;

  // Create search query
  const searchCriteria = {
      isPublished: true,
      $or: [
          { courseTitle: { $regex: query, $options: "i" } },
          { subTitle: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
      ],
  };

  // If categories are selected
  if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
  }

  // Define sorting order
  const sortOptions = {};
  if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // Sort by price in ascending order
  } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // Sort by price in descending order
  }

  try {
      const courses = await Course.find(searchCriteria)
          .populate({ path: "creator", select: "name photoUrl" })
          .sort(sortOptions);

      return res.status(200).json({
          success: true,
          courses: courses || [],
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Failed to fetch courses",
          error: error.message,
      });
  }
});