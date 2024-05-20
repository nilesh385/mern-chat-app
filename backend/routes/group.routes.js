import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createGroup,
  getGroupMessages,
} from "../controllers/group.controllers.js";

const router = express.Router();

router.route("/").post(authUser, getGroupMessages);
router.route("/create").post(authUser, createGroup);

export default router;
