const chatbotSchema = require("../../../models/server/chatbot-channel");

module.exports = {
    name: "chatbot",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const chatbotData = await chatbotSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            const channel = message.mentions.channels.last();
            if (!channel) return message.reply("Please mention a channel!");

            if (!chatbotData) await chatbotSchema.create({ Guild: message.guild.id, Channel: channel.id });
            else {
                chatbotData.Channel = channel.id;
                await chatbotData.save();
            }

            return message.channel.send(`Saved chatbot channel to ${channel}.`);
        }

        if (options === "off") {
            if (!chatbotData) return message.reply("Chatbot is already off.");

            await chatbotData.delete();

            return message.channel.send("Turned off chatbot.");
        }

    }
}