const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");

module.exports = {
    name: "stop",
    description: "Stop the player",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        if (client.music === false) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({
                    name: `${client.user.username} will not be doing music anymore, please \`youtube\``
                })
                .setColor("BLUE")
            ]
        });

        const player = client.music.get(interaction.guild.id);
        if (!player) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        let { channel } = interaction.member.voice; 

        if (!channel) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("Sorry, but you need to be in a voice channel to do that")
                .setColor("YELLOW")
            ]
        });

        if (player.voiceChannel !== channel.id) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("You are not in my voice channel")
                .setColor("YELLOW")
            ]
        });

        if (player.playing) return stop();
        else if (player.paused) return stop();
        else return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        function stop() {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("⏹ **|** The music player has been stopped")
                    .setColor("BLUE")
                ]
            });
            player.destroy();
        }

    },
};