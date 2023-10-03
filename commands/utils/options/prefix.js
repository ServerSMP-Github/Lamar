const prefixSchema = require("../../../models/server/prefix");

module.exports = {
    name: "prefix",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();

        if (!["set", "reset"].includes(options)) return message.reply("Invalid arguments");
        const prefixData = await prefixSchema.findOne({ Guild: message.guild.id });

        if (options === "set") {
            const res = args[2];

            if (!res) return message.channel.send("Please specify a prefix to change to.");
            if (res.match(/^(?:<@!?)?(\d{16,22})>/gi) || res.match(/^(?:<#?)?(\d{16,22})>$/gi) || res.match(/^(?:<:(?![\n])[()#$@-\w]+:?)?(\d{16,22})>$/gi)) return message.reply("Prefix has problematic characters.");
            if (res.length > 10) return message.reply("No prefix longer then 10.");

            if (prefixData) {
                prefixData.Prefix = res;
                await prefixData.save();

                return message.channel.send(`Your prefix has been updated to **${res}**`);
            } else {
                await prefixSchema.create({ Guild: message.guild.id, Prefix: res });

                return message.channel.send(`Custom prefix in this server is now set to **${res}**`);
            }

        }

        if (options === "reset") {
            if (!prefixData) return message.channel.send("You dont have a custom prefix!");

            await prefixData.deleteOne();

            return message.channel.send(`The prefix has been reset to ${client.config.bot.info.prefix}`);
        }
    }
}