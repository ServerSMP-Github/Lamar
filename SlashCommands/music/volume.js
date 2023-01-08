const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const progressbar = require('../../assets/api/progressbar/index');

module.exports = {
    name: "volume",
    description: "change or check the volume of the current song",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "percentage",
        description: "percentage to change the volume to",
        type: ApplicationCommandOptionType.Integer,
        required: false,
    }],
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

        // if (!player.playing) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("There is nothing playing")
        //         .setColor("Yellow")
        //     ]
        // });

        const volumePercentage = interaction.options.getInteger("percentage");

        let bar;

        // if (!volumePercentage) {
        //     bar = progressbar.filledBar(100, Number(queue.volume), 40, "□", "■")[0];
        //     return interaction.followUp({
        //         embeds: [
        //             new EmbedBuilder()
        //             .setDescription(`🔊 **|** The current volume is **\`${queue.volume}\`**%`)
        //             .setFooter({
        //                 text: String(bar)
        //             })
        //             .setColor("Blue")
        //         ]
        //     });
        // }

        if (volumePercentage < 0 || volumePercentage > 100) return interaction.followUp({
            content: "I can't set the volume above **`100`**% or below **`0`**%",
        });

        player.setVolume(volumePercentage);

        return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription(`🔊 **|** Volume set to **\`${volumePercentage}\`**%`)
                .setFooter({
                    text: progressbar(client, volumePercentage, 100, 40, "□", "■")
                })
                .setColor("Blue")
            ]
        });

    },
};