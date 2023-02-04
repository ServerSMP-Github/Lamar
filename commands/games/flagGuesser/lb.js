const lb = require("../../../models/user/fg-leaderboard");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "lb",
    run: async (client, message, args) => {
        const cmd = [];

        const data = await lb.find().sort({ "points": -1 })

        if (data.length < 1) return message.channel.send("No one has played yet!");

        data.map(async (val, i) => {
            const userParsed = await client.users.fetch(val.id);
            cmd.push(`**${i + 1}**. - *${userParsed.username}#${userParsed.discriminator}*\nPoints: \`${val.points}\``);
        });

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Leaderboard")
                .setDescription(`${cmd.splice(0, 10).join("\n\n")}`)
                .setColor("Random")
            ]
        });
    }
}