const autoroleSchema = require("../../../models/server/autorole");

module.exports = {
    name: "autorole",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const autoroleData = await chatbotSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            const role = message.mentions.roles.last();
            if (!role) return message.reply("Please mention a role!");

            if (!autoroleData) await autoroleSchema.create({ Guild: message.guild.id, Role: role.id });
            else {
                autoroleData.Role = role.id;
                await autoroleData.save();
            }

            return message.channel.send(`${role.name} is the autorole!`);
        }

        if (options === "off") {
            if (!autoroleData) return message.reply("Autorole is already off.");

            await autoroleData.deleteOne();

            return message.channel.send("Removed autorole!");
        }

    }
}