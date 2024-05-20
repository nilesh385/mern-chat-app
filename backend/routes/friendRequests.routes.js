import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "../controllers/friendRequests.controllers.js";

const router = express.Router();

router.route("/").get(authUser, getFriendRequests);
router.route("/accept/:requestId").put(authUser, acceptFriendRequest);
router.route("/reject/:requestId").put(authUser, rejectFriendRequest);
router.route("/send").post(authUser, sendFriendRequest);

export default router;
