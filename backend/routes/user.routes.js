import express from "express";
import {
  getSuggestedUsers,
  getUser,
  login,
  logout,
  searchUsers,
  signup,
  updateUserProfile,
} from "../controllers/user.controllers.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.route("/user/:query").get(getUser);
router.route("/suggestedUsers").get(authUser, getSuggestedUsers);
router.route("/search/:query").get(authUser, searchUsers);
router.route("/logout").get(logout);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/updateProfile").post(authUser, updateUserProfile);

export default router;
