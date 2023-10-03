const nsfwSchema = require("../../../models/server/nsfw");

module.exports = {
    name: "nsfw",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        const innerOption = args[2]?.toLowerCase();
        const innerInnerOption = args[3]?.toLowerCase();

        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");
        const nsfwData = await nsfwSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            if (!nsfwData) await nsfwSchema.create({ Guild: message.guild.id, Channels: [] });

            return message.channel.send("Turned on NSFW.");
        }

        if (options === "off") {
            if (!nsfwData) return message.reply("NSFW is turned off.");

            await nsfwData.deleteOne();

            return message.channel.send("Turned of NSFW.");
        }

        if (options === "channel") {
            const channel = message.mentions.channels.last();
            if (!["add", "remove"].includes(innerOption)) return message.reply("Invalid arguments");

            if (innerOption === "add") {
                if (!channel) return message.reply("Invalid arguments");

                if (!nsfwData) return message.reply("NSFW is turned off.");

                if (nsfwData.Channels.includes(channel.id)) return message.reply("Channel already on the list!");
                nsfwData.Channels.push(channel.id);
                await nsfwData.save();

                return message.channel.send(`Added ${channel} to NSFW whitelist.`);
            }

            if (innerOption === "remove") {
                if (!"all"=== innerInnerOption || !channel) return message.reply("Invalid arguments");

                if (!nsfwData) return message.reply("NSFW is turned off.");

                if (innerInnerOption === "all") {
                    nsfwData.Channels = [];
                    await nsfwData.save();

                    return message.channel.send("Removed all NSFW channels.");
                }

                if (channel) {
                    if (!nsfwData.Channels.includes(channel.id)) return message.reply("Channel is not on the list!");
                    nsfwData.Channels.splice(nsfwData.Channels.indexOf(channel.id), 1);
                    await nsfwData.save();

                    return message.channel.send(`Removed ${channel} from NSFW whitelist.`);
                }
            }

        }

    }
}