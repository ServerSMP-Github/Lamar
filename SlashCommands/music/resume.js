const { EmbedBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
    name: "resume",
    description: "Resume the currently paused song.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        if (client.config.music.enabled === false || (client.config.music.whitelist && client.config.music.whitelist.includes(interaction.guild.id) === false)) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `${client.user.username} will not be doing music anymore, please use \`youtube together\`` })
                .setColor("Blue")
            ]
        });

        const player = client.poru.players.get(interaction.guild.id);
        if (!player) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("Yellow")
            ]
        });

        let { channel } = interaction.member.voice; 

        if (!channel) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("Sorry, but you need to be in a voice channel to do that")
                .setColor("Yellow")
            ]
        });

        if (player.voiceChannel !== channel.id) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("You are not in my voice channel")
                .setColor("Yellow")
            ]
        });

        if (player.isPaused) {
            player.pause(false);
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("▶ **|** The music player has been resumed")
                    .setColor("Blue")
                ]
            });
        } else if (player.isPlaying) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("▶ **|** The music player is already resumed")
                .setColor("Yellow")
            ]
        });
        else return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("Yellow")
            ]
        });

    },
};