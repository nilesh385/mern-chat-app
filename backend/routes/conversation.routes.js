import express from "express";
import authUser from "../middlewares/authUser.js";
import { getConversations } from "../controllers/conversation.controllers.js";

const router = express.Router();

router.route("/").get(authUser, getConversations);

export default router;
