const inviteSchema = require("../../../models/logs/invites");

module.exports = {
    name: "invite",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const inviteData = await inviteSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            const channel = message.mentions.channels.last();
            if (!channel) return message.reply("Please mention a channel!");

            if (!inviteData) await inviteData.create({ Guild: message.guild.id, Channel: channel.id });
            else {
                inviteData.Channel = channel.id;
                await inviteData.save();
            }

            return message.reply(`${channel} has been set as the invite channel.`);
        }

        if (options === "off") {
            if (!inviteData) return message.reply("This server has no invite channel!");

            await inviteData.delete();

            return message.reply("Deleted invite channel!");
        }
    }
}