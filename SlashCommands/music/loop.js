const {
EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "loop",
    description: "Sets loop mode",
    options: [{
        name: "mode",
        type: "INTEGER",
        description: "Loop type",
        required: true,
        choices: [{
                name: "Off",
                value: 1
            },
            {
                name: "Track",
                value: 2
            },
            {
                name: "Queue",
                value: 3
            }
        ]
    }],
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

        const mode = interaction.options.get("mode").value;

        if (mode === 1) {
            if (player.queueRepeat === false && player.trackRepeat === false) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("▶ **|** The repeat mode is already set to **\`OFF\`**")
                    .setColor("YELLOW")
                ]
            });
            player.setQueueRepeat(false);
            player.setTrackRepeat(false);
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`▶ **|** The repeat mode has been set to **\`OFF\`**`)
                    .setColor("BLUE")
                ]
            });
        } else if (mode === 3) {
            if (player.queueRepeat === true) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🔁 **|** The repeat mode is already set to **\`ALL\`**")
                    .setColor("YELLOW")
                ]
            });
            player.setQueueRepeat(true);
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🔁 **|** The repeat mode has been set to **\`ALL\`**`)
                    .setColor("BLUE")
                ]
            });
        } else if (mode === 2) {
            if (player.trackRepeat === true) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🔂 **|** The repeat mode is already set to **\`ONE\`**")
                    .setColor("YELLOW")
                ]
            });
            player.setTrackRepeat(true);
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🔂 **|** The repeat mode has been set to **\`ONE\`**`)
                    .setColor("BLUE")
                ]
            });
        } else return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription(`An error occurred while updating loop mode`)
                .setColor("RED")
            ]
        });

    },
};