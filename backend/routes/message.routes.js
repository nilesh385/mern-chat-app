import express from "express";
import {
  getPersonalMessages,
  sendMessage,
} from "../controllers/message.controllers.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.route("/get/:receiverId").get(authUser, getPersonalMessages);
router.route("/send").post(authUser, sendMessage);

export default router;
