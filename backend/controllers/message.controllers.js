import { Conversation } from "../models/conversation.models.js";
import { Message } from "../models/message.models.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { contentType, receiverId, messageType, conversationId } = req.body;
    let { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Please provide a message" });
    }

    //the message is sent in a group conversation
    if (messageType === "group") {
      if (!conversationId) {
        return res.status(400).send({ error: "Conversation id is required" });
      }

      const isConversationExist = await Conversation.findOne({
        _id: conversationId,
      });

      if (!isConversationExist) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      if (contentType === "image") {
        try {
          const response = await cloudinary.uploader.upload(content);
          content = response.secure_url;
        } catch (error) {
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      // Create a new message
      const message = new Message({
        senderId,
        receiverId,
        content,
        contentType: contentType || "text",
        messageType,
        conversationId,
      });

      await message.save();

      // Update conversation lastMessage (using findByIdAndUpdate)
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: {
            lastMessage: {
              content: message.content,
              contentType: message.contentType,
              senderId,
            },
          },
        }
      );

      if (!updatedConversation) {
        console.error("Failed to update conversation lastMessage");
      }

      //socket.io
      io.in(conversationId).emit("newMessage", message);

      return res.status(201).json(message);
    }
    // the message is of a private conversation
    else {
      // Check if the sender and receiver are friends or not
      const senderFriends = await User.findById(senderId).select("friends");
      const receiverFriends = await User.findById(receiverId).select("friends");

      const isSenderInReceiverFriends = receiverFriends.friends.some(
        (friendId) => friendId.equals(senderId)
      );
      const isReceiverInSenderFriends = senderFriends.friends.some((friendId) =>
        friendId.equals(receiverId)
      );

      if (!isSenderInReceiverFriends || !isReceiverInSenderFriends) {
        return res.status(400).json({
          error: "You are not friends with this user.",
        });
      }

      // Check if there's an existing private conversation between the sender and receiver
      const existingConversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        type: "private",
      }).lean();

      let conversation;

      if (!existingConversation) {
        // If no existing conversation, create a new one
        conversation = new Conversation({
          participants: [senderId, receiverId],
          type: "private",
        });
        await conversation.save();
      } else {
        conversation = existingConversation;
      }

      if (contentType === "image") {
        try {
          const response = await cloudinary.uploader.upload(content);
          content = response.secure_url;
        } catch (error) {
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      // Create a new message
      const message = new Message({
        senderId,
        receiverId,
        content,
        contentType: contentType || "text",
        conversationId: conversation._id,
      });

      await message.save();

      // Update conversation lastMessage (using findByIdAndUpdate)
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversation._id,
        {
          $set: {
            lastMessage: {
              content: message.content,
              contentType: message.contentType,
              senderId,
            },
          },
        }
      );

      if (!updatedConversation) {
        console.error("Failed to update conversation lastMessage");
      }

      //socket.io
      const receiverSocketId = getReceiverSocketId(receiverId);
      io.to(receiverSocketId).emit("newMessage", message);

      return res.status(201).json(message);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPersonalMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Check if the sender and receiver are friends or not
    const senderFriends = await User.findById(senderId).select("friends");
    const receiverFriends = await User.findById(receiverId).select("friends");

    const isSenderInReceiverFriends = receiverFriends.friends.some((friendId) =>
      friendId.equals(senderId)
    );
    const isReceiverInSenderFriends = senderFriends.friends.some((friendId) =>
      friendId.equals(receiverId)
    );

    if (!isSenderInReceiverFriends || !isReceiverInSenderFriends) {
      return res.status(400).json({
        error: "You are not friends with this user.",
      });
    }

    // Find all messages where senderId or receiverId matches the provided IDs
    const messages = await Message.find({
      $or: [{ senderId }, { receiverId }],
    }).sort({ createdAt: 1 }); // Sort by creation time (ascending)

    //using pagination
    /* const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [{ senderId }, { receiverId }],
    })
      .sort({ createdAt: 1 }) // Sort by creation time (ascending)
      .skip(skip)
      .limit(limit);

    let totalMessages;
    if (req.query.total) { // Check if total is requested in query param
      totalMessages = await Message.countDocuments({
        $or: [{ senderId }, { receiverId }],
      });
    } */

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { sendMessage, getPersonalMessages };
