import asyncHandler from "express-async-handler";
import Course from "../models/courseModel.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;

  if (!courseTitle || !category) {
    return res
      .status(400)
      .json({
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
