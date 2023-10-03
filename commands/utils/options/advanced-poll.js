const pollSchema = require("../../../models/server/poll");

module.exports = {
    name: "advanced-poll",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "add", "off", "rmv"].includes(options)) return message.reply("Invalid arguments");

        const channel = message.mentions.channels.last();
        if (!channel && ["on", "add", "rmv"].includes(options)) return message.reply("Please mention a channel!");

        const pollData = await altSchema.findOne({ Guild: message.guild.id });

        if (["on", "add"].includes(options)) {
            if (!pollData) await pollSchema.create({
                Guild: message.guild.id,
                Channels: [channel.id],
            });
            else {
                pollData.Channels.push(channel.id);
                await pollData.save();
            }

            return message.channel.send(`Added channel ${channel} to the list!`);
        }

        if (options === "rmv") {
            if (pollData) return message.reply("Advanced Poll is not enabled!");

            const index = pollData.Channels.indexOf(channel.id);
            if (index < -1) return message.reply("That channel is not on the list!");

            pollData.Channels.splice(index, 1);
            await pollData.save();

            return message.channel.send(`Removed channel ${channel} from the list!`);
        }

        if (options === "off") {
            if (pollData) return message.reply("Advanced Poll is already off!");

            await pollData.deleteOne();

            return message.channel.send("Advanced Poll has been turned off!");
        }

    }
}