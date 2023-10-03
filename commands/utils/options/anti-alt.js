const altSchema = require("../../../models/moderator/altDetectionSystem");

module.exports = {
    name: "anti-alt",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const innerOptions = args[2]?.toLowerCase();
        const innerinnerOptions = args[2]?.toLowerCase();

        const altData = await altSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            if (altData) return message.reply("Anti-alt is already on!");

            if (!["ban", "kick"].includes(innerOptions)) return message.reply("Please specify a punishment type! (ban or kick)");
            if (!["true", "false"].includes(innerinnerOptions)) return message.reply("Please specify if you want it to send msg to user! (true or false)");

            await altSchema.create({ Guild: message.guild.id, Type: innerOptions, Message: innerinnerOptions == "true" ? true : false });

            return message.channel.send("Anti-alt is turned on!");
        }

        if (options === "off") {
            if (!altData) return message.reply("Anti-alt is already off!");

            await altData.deleteOne();

            return message.channel.send("Anti-alt is turned off!");
        }

    }
}