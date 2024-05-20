import mongoose from "mongoose";
import { Conversation } from "../models/conversation.models.js";
import { Group } from "../models/group.models.js";
import { v2 as cloudinary } from "cloudinary";
import { Message } from "../models/message.models.js";
import { User } from "../models/user.models.js";
import { io } from "../socket/socket.js";

const createGroup = async (req, res) => {
  try {
    const currentUser = req.user;
    const { name, description, groupPhoto, participants } = res.body;

    if (!name) {
      return res.status(401).json({ error: "Name is required for a group." });
    }
    if (participants.length < 2) {
      return res
        .status(401)
        .json({ error: "A group must have at least 2 participants." });
    }

    const conversation = await Conversation.create({
      participants: [currentUser._id, ...participants],
      type: "group",
    });

    if (groupPhoto) {
      const { secure_url } = await cloudinary.uploader.upload(groupPhoto);
      groupPhoto = secure_url;
    }

    const group = await Group.create({
      name,
      description,
      creator: req.user._id,
      conversationId: conversation._id,
    });

    if (!group) {
      return res.status(400).json * { error: "unable to create group" };
    }

    const participantsToUpdate = conversation.participants;

    await Promise.all(
      participantsToUpdate.map(async (participantId) => {
        try {
          await User.findByIdAndUpdate(participantId, {
            $push: { groups: group._id },
          });
        } catch (error) {
          console.log(error.message);
        }
      })
    );

    return res
      .status(200)
      .json({ message: "conversation created successfully", group });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation id" });
    }

    const conversationExists = await Conversation.findOne({
      _id: conversationId,
      users: { $elemMatch: { $eq: req.user._id } },
    });
    if (!conversationExists) {
      return res.status(400).json({ error: "Conversation does not exist" });
    }

    if (conversationExists.type !== "group") {
      return res.status(404).json({ error: "Conversation is not a group" });
    }

    const messages = await Message.find({ conversationId });

    if (messages.length === 0) {
      return res.status(400).json({ error: "No messages found" });
    }

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res.status(404).json({ error: "group not found" });
    }

    await Conversation.findByIdAndUpdate(
      {
        _id: group.conversationId,
      },
      {
        $pull: {
          members: userId,
        },
      }
    );

    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          groups: groupId,
        },
      }
    );
    return res.status(200).json({ message: "Group left." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addParticipantInGroup = async (req, res) => {
  try {
    const { groupId, newParticipantId } = req.body;
    const currentUserId = req.user._id;

    if (!groupId || !newParticipantId) {
      return res.status(400).json({ error: "Provide required fields." });
    }

    const userExist = await User.findById(newParticipantId);
    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    if (group.creator !== currentUserId) {
      return res
        .status(400)
        .json({ error: "You are not allowed to add new participants." });
    }

    const conversation = await Conversation.findById(group.conversationId);

    if (!conversation) {
      return res.status(400).json({ message: "Conversation not found" });
    }

    if (conversation.members.includes(newParticipantId)) {
      return res
        .status(400)
        .json({ message: "The participant already exists in the group." });
    }

    conversation.participants.push(newParticipantId);

    await conversation.save();

    // Emit event to group
    io.in(group.conversationId).emit("participantAdded", {
      groupId: group._id,
      conversationId: conversation._id,
      newParticipantId,
    });

    return res
      .status(200)
      .json({ message: "Member added successfully", conversation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const removeParticipantFromGroup = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  createGroup,
  getGroupMessages,
  leaveGroup,
  addParticipantInGroup,
  removeParticipantFromGroup,
  deleteGroup,
};
