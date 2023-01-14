const chatbotSchema = require('../../models/server/chatbot-channel');
const client = require("../../index");

module.exports = async(guild) => {
    const chatbotData = await chatbotSchema.findOne({ Guild: guild.id });

    if (chatbotData) await chatbotData.delete();
}