const { EmbedBuilder, Message, Client, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Schema = require("../../models/logs/reaction-roles");


module.exports = {
    name: "reaction-roles",
    usage: "[ description? ]",
    aliases : ["rr"],
    description : "Creates reaction roles!",
    userPermission: [PermissionsBitField.Flags.ManageGuild],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {

        let roles = [];

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Reaction Roles - Documentation")
                .addFields({ name: "Basic Usage", value: "Send messages in `roleID emoji` syntax! Once finished say `done`." })
                .setImage("https://api.serversmp.xyz/upload/634406631a73f8b719c0634d.png")
                .setColor("Random")
            ]
        });

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, max: 25, time: 600000 });

        collector.on("collect", async (msg) => {
            if (!msg.content) return message.channel.send("Invalid syntax");

            if (msg.content.toLowerCase() == "done") return collector.stop("DONE");

            const role = msg.content.split(" ")[0];
            if (!role) return message.channel.send("Invalid role");

            const reaction = (await msg.react(msg.content.split(" ").slice(msg.content.split(" ").length - 1).join(" ")).catch(/*() => null*/console.log));
            if (!reaction) return message.channel.send("Invalid emoji");

            roles.push({
                role: role,
                emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
            });
        });

        collector.on("end", async (msgs, reason) => {
            if (reason == "DONE") return createReaction();
            else if (reason == "time") return message.channel.send("Took to long to complete.");
        });

        async function createReaction() {
            if (!roles.length) return message.channel.send("You need at least one role.");

            const msgObject = await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Reaction roles!")
                    .setDescription(args.length === 1 ? isNaN(args[0]) === true ? (await message.channel.messages.fetch(args[0])).content : args.join(" ") : args.length > 1 ? args.join(" ") : "Click on the reaction to get the specific role or vice-versa")
                    .setColor("Random")
                    .setTimestamp()
                ]
            });

            for (let index = 0; index < roles.length; index++) {
                const element = roles[index];

                msgObject.react(element.emoji);
            }

            await Schema.create({
                Guild: message.guild.id,
                Channel: message.channel.id,
                Message: msgObject.id,
                Roles: roles,
            });

        }

    }
}
