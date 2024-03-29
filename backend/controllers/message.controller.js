const messageModel = require('../models/messages.model');

//createMessage
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const result = await message.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

//getMessages
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports = {
  createMessage,
  getMessages,
};
