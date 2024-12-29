import asyncHandler from "express-async-handler";
import Lecture from "../models/lectureModel.js";
import Course from "../models/courseModel.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";

export const createLecture = asyncHandler(async (req, res) => {
  const { lectureTitle } = req.body;
  const { courseId } = req.params;

  // Validate input
  if (!lectureTitle || !courseId) {
    return res.status(400).json({
      message: "Lecture title and course ID are required.",
      success: false,
    });
  }
  // Create the lecture
  const lecture = await Lecture.create({ lectureTitle });

  // Find the course and associate the lecture
  const course = await Course.findById(courseId);
  if (!course) {
    await Lecture.findByIdAndDelete(lecture._id); // Clean up if course not found
    return res.status(404).json({
      message: "Course not found.",
      success: false,
    });
  }

  // Push lecture ID to course lectures array
  course.lectures.push(lecture._id);
  await course.save();

  return res.status(201).json({
    message: "Lecture created successfully.",
    success: true,
    lecture,
  });
});

export const getCourseLecture = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    // Validate input
    if (!courseId) {
        return res.status(400).json({ 
            message: "Course ID is required.", 
            success: false 
        });
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
        return res.status(404).json({ 
            message: "Course not found.", 
            success: false 
        });
    }

    return res.status(200).json({ 
        message: "Lectures retrieved successfully.", 
        success: true, 
        lectures: course.lectures 
    });
});


export const updateLecture = asyncHandler(async (req, res) => {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found!",
            success: false
        });
    }

    // Update lecture fields
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not already added
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
        course.lectures.push(lecture._id);
        await course.save();
    }

    return res.status(200).json({
        message: "Lecture updated successfully.",
        success: true,
        lecture
    });
});

export const removeLecture = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;

    // Find and delete the lecture
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found!",
            success: false
        });
    }

    // Delete the video from Cloudinary if it exists
    if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await Course.updateOne(
        { lectures: lectureId }, // Find the course that contains the lecture
        { $pull: { lectures: lectureId } } // Remove the lecture ID from the lectures array
    );

    return res.status(200).json({
        message: "Lecture removed successfully.",
        success: true
    });
});

export const getLectureById = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;

    // Find the lecture by ID
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found!",
            success: false
        });
    }

    return res.status(200).json({
        message: "Lecture retrieved successfully.",
        success: true,
        lecture
    });
});
