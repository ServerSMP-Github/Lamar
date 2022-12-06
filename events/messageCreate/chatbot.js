const chatSchema = require('../../models/server/chatbot-channel');
const client = require("../../index");

module.exports = async (message) => {
    if (!message.guild || message.author.bot) return;

    const chatData = await chatSchema.findOne({ Guild: message.guild.id });

    if (!chatData) return;

    if (message.channel.id !== chatData.Channel) return;

    const url = client.config.api.chatbot == "easy-discord-chatbot" ? `https://api.affiliateplus.xyz/api/chatbot?message=${message.content}&botname=${client.user.username}` : client.config.api.chatbot ? `https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}&key=${client.config.api.chatbot}` : `https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`;

    const msg = await (await fetch(url)).json();

    return message.channel.send(msg.response);
}