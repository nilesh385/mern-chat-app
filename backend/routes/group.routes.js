import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addParticipantInGroup,
  createGroup,
  deleteGroup,
  getGroupMessages,
  leaveGroup,
  removeParticipantFromGroup,
  updateGroup,
} from "../controllers/group.controllers.js";

const router = express.Router();

router.route("/:conversationId").get(authUser, getGroupMessages);
router.route("/leave/:gorupId").get(authUser, leaveGroup);
router.route("/delete/:gorupId").get(authUser, deleteGroup);
router.route("/create").post(authUser, createGroup);
router.route("/update").post(authUser, updateGroup);
router.route("/addParticipant").post(authUser, addParticipantInGroup);
router.route("/removeParticipant").post(authUser, removeParticipantFromGroup);

export default router;
