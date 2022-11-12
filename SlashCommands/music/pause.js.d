const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "pause",
    description: "Pause the current song",
    run: async (client, interaction) => {

        if (client.music === false) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: `${client.user.username} will not be doing music anymore, please \`youtube\``
                })
                .setColor("BLUE")
            ]
        });

        const player = client.music.get(interaction.guild.id);
        if (!player) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        let { channel } = interaction.member.voice; 

        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("Sorry, but you need to be in a voice channel to do that")
                .setColor("YELLOW")
            ]
        });

        if (player.voiceChannel !== channel.id) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("You are not in my voice channel")
                .setColor("YELLOW")
            ]
        });

        if (player.playing) {
            player.pause(true);
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription("⏸ **|** The music player has been paused")
                    .setColor("BLUE")
                ]
            });
        } else if (player.paused) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("⏸ **|** The music player is already paused")
                .setColor("YELLOW")
            ]
        });
        else return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

    },
};
