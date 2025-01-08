import express from "express";
import { createCourse, editCourse, getCourseById, getCreatorCourses, getPublishedCourses, removeCourse, searchCourse, togglePublish } from "../controllers/courseController.js";
import upload from "../utils/multer.js"
import { createLecture, getCourseLecture, getLectureById, removeLecture, updateLecture } from "../controllers/lectureController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/").post(isAuthenticated,createCourse)
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get(isAuthenticated,getPublishedCourses)
router.route("/").get(isAuthenticated,getCreatorCourses)
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated,getCourseById);
router.route("/:courseId").patch(isAuthenticated, togglePublish);
router.route("/:courseId").delete(isAuthenticated, removeCourse);


// For Lectures
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").put(isAuthenticated,updateLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);

export default router;