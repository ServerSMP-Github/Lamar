const chatSchema = require("../../models/server/chatbot-channel");
const client = require("../../index");

module.exports = async(channel) => {
    const chatData = await chatSchema.findOne({ Channel: channel.id });

    if (chatData) await chatData.deleteOne();
}