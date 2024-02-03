const chatModel = require('../models/chat.model');

//1. createChat
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//2. findUserChats
const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//3. findChat}
const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
    createChat,
    findUserChats,
    findChat
}
