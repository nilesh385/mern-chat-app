import { Conversation } from "../models/conversation.models.js";

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    });
    if (!conversations || conversations.length === 0) {
      return res.status(400).json({ error: "No conversations found" });
    }
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { getConversations };
