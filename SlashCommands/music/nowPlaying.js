const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");

module.exports = {
    name: "nowplaying",
    description: "Shows information about the current song",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        if (client.config.music.enabled === false) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({
                    name: `${client.user.username} will not be doing music anymore, please use \`youtube together\``
                })
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

        // let { channel } = interaction.member.voice; 

        // if (!channel) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("Sorry, but you need to be in a voice channel to do that")
        //         .setColor("Yellow")
        //     ]
        // });

        // if (player.voiceChannel !== channel.id) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("You are not in my voice channel")
        //         .setColor("Yellow")
        //     ]
        // });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle("Now Playing")
                .setDescription(`🎶 | [**${player.currentTrack.info.title}**](${player.currentTrack.info.uri})!`)
                .setFooter({ text: `Queued by ${player.currentTrack.info.requester.user.username}`, iconURL: player.currentTrack.info.requester.displayAvatarURL() })
                .setColor("Blue")
            ]
        });

    },
};