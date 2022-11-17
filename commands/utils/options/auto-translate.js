const translateSchema = require("../../../models/server/translate");

module.exports = {
    name: "auto-translate",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off", "percent"].includes(options)) return message.reply("Invalid arguments");

        const translateData = await translateSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            if (translateData) return message.reply("Auto-translate is already on!");

            await translateSchema.create({ Guild: message.guild.id, Language: "en", Percent: 80 });

            return message.channel.send("Auto-translate is turned on!");
        }

        if (options === "off") {
            if (!translateData) return message.reply("Auto-translate is already off!");

            await translateData.delete();

            return message.channel.send("Auto-translate is turned off!");
        }

        if (options === "percent") {
            if (!translateData) return message.reply("Auto-translate is already off!");

            const percent = parseInt(args[3]);
            if (!percent) return message.reply("You must specify a percent!");

            if (percent > 100) return message.reply("Percentage must be more than 100!");
            if (percent < 50) return message.reply("Percentage must be less than 50!");
            if (translateData.Percent === percent) return message.reply("Percentage is allready set to this!");

            translateData.Percent = Number(percent);
            await translateData.save();

            return message.channel.send(`Auto-translate percentage has been set to ${percent}!`)
        }

    }
}