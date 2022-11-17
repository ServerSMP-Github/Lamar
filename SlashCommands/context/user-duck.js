const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const Schema = require("../../models/user/user-duck");
const fetch = require('axios');

module.exports = {
    name: "user duck",
    type: ApplicationCommandType.User,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const { user } = interaction.guild.members.cache.get(interaction.targetId);

        let userData = await Schema.findOne({ User: user.id });

        if (!userData) {
            const image = (await fetch("https://random-d.uk/api/v2/random")).data;

            userData = await Schema.create({
                User: user.id,
                URL: image.url
            });
        }

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle(`${user.username}'s duck`)
                .setImage(userData.URL)
            ]
        });

    },
};
