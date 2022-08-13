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

        // let { channel } = interaction.member.voice; 

        // if (!channel) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("Sorry, but you need to be in a voice channel to do that")
        //         .setColor("YELLOW")
        //     ]
        // });

        // if (player.voiceChannel !== channel.id) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("You are not in my voice channel")
        //         .setColor("YELLOW")
        //     ]
        // });

        const queue = player.queue;

        if (!queue.current) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle("Now Playing")
                .setDescription(`🎶 | [**${queue.current.title}**](${queue.current.uri})!`)
                .setFooter({ text: `Queued by ${queue.current.requester}` })
                .setColor("BLUE")
            ]
        });

    },
};