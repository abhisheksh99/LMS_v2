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


