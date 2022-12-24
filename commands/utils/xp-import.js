const {  Message, Client, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { createUser, setLevel } = require("../../assets/api/xp");
const getLeaderboard = require("../../assets/api/mee6");
const xpSchema = require("../../models/server/xp");

module.exports = {
    name: 'xp-import',
    description: "Import XP data from Mee6.",
    usage: "[ guildId? ]",
    userPermission: [PermissionsBitField.Flags.ManageGuild],

    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async(client, message, args) => {
        const guildId = args[0] ? args[0] : message.guild.id;
        if (!guildId) return message.reply("You must specify guild ID");

        message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Import Mee6 XP")
                .addFields([
                    {
                        name: "Information",
                        value: "This command will **import** the first **1000 users** xp data from **Mee6**"
                    },
                    {
                        name: "Setup",
                        value: "In the Mee6 dashboard, make your **leaderboard** page **public**"
                    }
                ])
                .setImage("https://api.serversmp.xyz/upload/634432731a73f8b719c06374.png")
            ]
        });

        const xpData = await xpSchema.findOne({ Guild: message.guild.id });
        if (!xpData) await xpSchema.create({
            Guild: message.guild.id,
            Channel: "false",
            Ping: false,
            WebUI: true,
            Rate: 6,
        });

        const mee6Data = await getLeaderboard(guildId);
        if (mee6Data?.error) return message.reply("An error has occurred. Please try again.");

        message.reply("Starting Mee6 import!");

        for (let index = 0; index < mee6Data.length; index++) {
            const element = mee6Data[index];

            await createUser(element.id, message.guild.id);
            if (element.level >= 1) await setLevel(element.id, message.guild.id, element.level);
            // if (element.xp >= 1) await Levels.appendXp(element.id, message.guild.id, element.xp);
        }

        return message.channel.send("Successfully imported Mee6 XP data!");
    }
}
