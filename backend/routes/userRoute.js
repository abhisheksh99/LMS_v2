import express from "express";
import { getUserProfileById, loginUser, logoutUser, registerUser, updateUserProfileById } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logoutUser);
router.route("/profile").get(isAuthenticated,getUserProfileById);
router.route("/profile/update").put(isAuthenticated,upload.single("profilePhoto"),updateUserProfileById);

export default router;
