const crosspostSchema = require("../../../models/server/crosspost");

module.exports = {
    name: "auto-publish",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const crosspostData = await crosspostSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            if (crosspostData) return message.reply("Auto-publish is allready on!");

            await crosspostSchema.create({ Guild: message.guild.id });

            return message.channel.send("Auto-publish is turned on!");
        }

        if (options === "off") {
            if (!crosspostData) return message.reply("Auto-publish is allready off!");

            await crosspostData.delete();

            return message.channel.send("uto-publish is turned off!");
        }

    }
}