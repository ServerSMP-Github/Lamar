const globalSchema = require("../../../models/server/global");

module.exports = {
    name: "global",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const globalData = await globalSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            const channel = message.mentions.channels.last();
            if (!channel) return message.reply("Please mention a channel!");

            if (!globalData) await globalSchema.create({ Guild: message.guild.id, Channel: channel.id });
            else {
                globalData.Channel = channel.id;
                await globalData.save();
            }

            return message.channel.send(`Saved international chat channel to ${channel}.`);
        }

        if (options === "off") {
            if (!globalData) return message.reply("Server does not have an international chat!");

            await globalData.delete();

            return message.channel.send("Removed international chat!");
        }

    }
}