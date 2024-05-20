import mongoose from "mongoose";
import { FriendRequests } from "../models/friendRequests.models.js";
import { User } from "../models/user.models.js";

const sendFriendRequest = async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;
  try {
    // Validate senderId and receiverId
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }
    //check if sender is sending himself a friend request
    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ error: "You can't send a friend request to yourself" });
    }

    // Check if the sender and receiver are already friends
    const senderFriends = await User.findById(senderId).select("friends");
    const receiverFriends = await User.findById(receiverId).select("friends");

    const isSenderInReceiverFriends = receiverFriends.friends.some((friendId) =>
      friendId.equals(senderId)
    );
    const isReceiverInSenderFriends = senderFriends.friends.some((friendId) =>
      friendId.equals(receiverId)
    );

    if (isSenderInReceiverFriends || isReceiverInSenderFriends) {
      return res.status(400).json({
        error: "You are already friends.",
      });
    }

    // Check if a friend request has already been sent
    const existingRequest = await FriendRequests.findOne({
      $or: [
        { senderId, receiverId },
        { receiverId, senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "Friend request has already been sent.",
      });
    }

    // Send the friend request
    const friendRequest = new FriendRequests({
      senderId,
      receiverId,
    });

    await friendRequest.save();

    // Add the friendRequest's _id to the sender's 'sentFriendRequests'
    await User.findByIdAndUpdate(senderId, {
      $push: { sentFriendRequests: friendRequest._id },
    });

    // Add the friendRequest's _id to the receiver's 'receivedFriendRequests'
    await User.findByIdAndUpdate(receiverId, {
      $push: { receivedFriendRequests: friendRequest._id },
    });

    res.json({ message: "Friend request sent successfully.", friendRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid friendRequests ID" });
    }

    // Find the friend request by its ID
    const friendRequest = await FriendRequests.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    // Update the status of the friend request
    if (friendRequest.status === "pending") {
      friendRequest.status = "accepted";
      await friendRequest.deleteOne({ _id: requestId });

      // remove the friendRequest's _id to the sender's 'sentFriendRequests'
      await User.findByIdAndUpdate(friendRequest.senderId, {
        $pull: { sentFriendRequests: friendRequest._id },
      });

      // Add the friendRequest's _id to the receiver's 'receivedFriendRequests'
      await User.findByIdAndUpdate(friendRequest.receiverId, {
        $pull: { receivedFriendRequests: friendRequest._id },
      });

      // Update the 'friends' and 'sentFriendRequests' or 'receivedFriendRequests' array of both the sender and receiver
      await User.findByIdAndUpdate(
        { _id: friendRequest.senderId },
        {
          $pull: { sendFriendRequest: friendRequest._id },
          $push: { friends: friendRequest.receiverId },
        }
      );
      await User.findByIdAndUpdate(
        { _id: friendRequest.receiverId },
        {
          $pull: { friendRequests: friendRequest._id },
          $push: { friends: friendRequest.senderId },
        }
      );

      return res.json({
        message: "Friend request accepted successfully.",
        friendRequest,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid friendRequests ID" });
    }

    // Find the friend request by its ID
    const friendRequest = await FriendRequests.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    // Update the status of the friend request
    if (friendRequest.status === "pending") {
      friendRequest.status = "rejected";
      await friendRequest.deleteOne({ _id: requestId });

      // remove the friendRequest's _id to the sender's 'sentFriendRequests'
      await User.findByIdAndUpdate(friendRequest.senderId, {
        $pull: { sentFriendRequests: friendRequest._id },
      });

      // Add the friendRequest's _id to the receiver's 'receivedFriendRequests'
      await User.findByIdAndUpdate(friendRequest.receiverId, {
        $pull: { receivedFriendRequests: friendRequest._id },
      });

      // Update the 'friends' and 'sentFriendRequests' or 'receivedFriendRequests' array of both the sender and receiver
      await User.findByIdAndUpdate(
        { _id: friendRequest.senderId },
        {
          $pull: { sendFriendRequest: friendRequest._id },
        }
      );
      await User.findByIdAndUpdate(
        { _id: friendRequest.receiverId },
        {
          $pull: { friendRequests: friendRequest._id },
        }
      );

      return res.json({
        message: "Rejected friend request.",
        friendRequest,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Query the User collection to find the current user's received friend requests
    const friendRequests = await User.findById(userId)
      .select("receivedFriendRequests -_id")
      .populate("receivedFriendRequests");

    if (friendRequests.length === 0 || !friendRequests) {
      return res.status(404).json({ error: "No friend requests found." });
    }

    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUser = req.use;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid friendRequests ID" });
    }

    const friendExists = await User.findById(friendId);
    if (!friendExists) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if the friend and current user are friends or not
    const currentUserFriends = await User.findById(currentUser).select(
      "friends"
    );
    const friendsOfFriend = await User.findById(friendId).select("friends");

    const isFriendInCurrentUsersFriends = friendsOfFriend.friends.some(
      (friendId) => friendId.equals(currentUser._id)
    );
    const isCurrentUserInFriendFriends = currentUserFriends.friends.some(
      (friendId) => friendId.equals(friendId)
    );

    if (!isCurrentUserInFriendFriends || !isFriendInCurrentUsersFriends) {
      return res.status(400).json({
        error: "You are not friends.",
      });
    }

    // Update the 'friends' array of both the current user and friend
    await User.findByIdAndUpdate(
      { _id: currentUser._id },
      {
        $pull: { friends: friendId },
      }
    );
    await User.findByIdAndUpdate(
      { _id: friendId },
      {
        $pull: { friends: currentUser._id },
      }
    );

    return res.status(200).json({ message: "Friend removed." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  deleteFriend,
};
