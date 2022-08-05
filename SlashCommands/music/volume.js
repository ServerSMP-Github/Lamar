const {
    MessageEmbed
} = require("discord.js");
const progressbar = require('string-progressbar');

module.exports = {
    name: "volume",
    description: "change or check the volume of the current song",
    options: [{
        name: "percentage",
        description: "percentage to change the volume to",
        type: "INTEGER",
        required: false,
    }],
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

        if (!player.playing) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        const volumePercentage = interaction.options.getInteger("percentage");

        let bar;

        if (!volumePercentage) {
            bar = progressbar.filledBar(100, Number(queue.volume), 40, "□", "■")[0];
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`🔊 **|** The current volume is **\`${queue.volume}\`**%`)
                    .setFooter({
                        text: String(bar)
                    })
                    .setColor("BLUE")
                ]
            });
        }

        if (volumePercentage < 0 || volumePercentage > 100) return interaction.followUp({
            content: "I can't set the volume above **`100`**% or below **`0`**%",
        });

        player.setVolume(volumePercentage);

        bar = progressbar.filledBar(100, Number(volumePercentage), 40, "□", "■")[0];
        return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription(`🔊 **|** Volume set to **\`${volumePercentage}\`**%`)
                .setFooter({
                    text: String(bar)
                })
                .setColor("BLUE")
            ]
        });

    },
};