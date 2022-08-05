const { Client, CommandInteraction, EmbedBuilder, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const Schema = require("../../models/user/user-duck");
const fetch = require('axios');

module.exports = {
    name: "user duck",
    type: "USER",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        Schema.findOne({ User: interaction.targetId }, async(err, data) => {
            if(data) {
                const guild = client.guilds.cache.get(interaction.guild.id)
                const user_find = guild.members.cache.get(interaction.targetId)
                interaction.followUp({ embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setTitle(`${user_find.user.username}'s duck`)
                        .setImage(await data.URL)
                ]})
            }

            if(!data) {
                if(interaction.member.user.id !== interaction.targetId) return interaction.followUp("This user does not have a user duck.")
                fetch("https://random-d.uk/api/v2/random")
                .then(async(duck) => {
                    new Schema({
                        User: interaction.targetId,
                        URL: await duck.data.url
                    }).save();
                    const guild = client.guilds.cache.get(interaction.guild.id)
                    const user_find = guild.members.cache.get(interaction.targetId)
                    interaction.followUp({ embeds: [
                        new EmbedBuilder()
                            .setColor("Random")
                            .setTitle(`${user_find.user.username}'s duck`)
                            .setImage(await duck.data.url)
                    ]})
                })
            }

        });

    },
};
