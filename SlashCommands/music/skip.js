const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");

module.exports = {
    name: "skip",
    description: "Skips a song",
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

        // if (player.playing) return skip();
        // else if (player.paused) return skip();
        // else return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("There is nothing playing")
        //         .setColor("Yellow")
        //     ]
        // });

        // function skip() {
        player.stop();

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("⏭ **|** Skipped **current** song")
                .setColor("Blue")
            ]
        });
        // }

    },
};