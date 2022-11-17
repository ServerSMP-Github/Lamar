const boostSchema = require("../../../models/logs/boost");

module.exports = {
    name: "boost",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const boostData = await boostSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            const channel = message.mentions.channels.last();
            if (!channel) return message.reply("Please mention a channel!");

            if (boostData) await boostSchema.create({ Guild: message.guild.id, Channel: channel.id });
            else {
                boostData.Channel = channel.id;
                await boostData.save();
            }

            return message.channel.send("Boost msg is turned on!");
        }

        if (options === "off") {
            if (!boostData) return message.reply("Boost msg is already off!");

            await boostData.delete();

            return message.channel.send("Boost msg is turned off!");
        }

    }
}