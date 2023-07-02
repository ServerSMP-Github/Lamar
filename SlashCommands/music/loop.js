const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "loop",
    description: "Sets loop mode",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "mode",
        type: ApplicationCommandOptionType.Integer,
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

        const mode = interaction.options.get("mode").value;

        if (mode === 1) {
            if (player.loop === "NONE") return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("▶ **|** The repeat mode is already set to **\`OFF\`**")
                    .setColor("Yellow")
                ]
            });
            player.setLoop("NONE");
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`▶ **|** The repeat mode has been set to **\`OFF\`**`)
                    .setColor("Blue")
                ]
            });
        } else if (mode === 3) {
            if (player.loop === "QUEUE") return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🔁 **|** The repeat mode is already set to **\`ALL\`**")
                    .setColor("Yellow")
                ]
            });
            player.setLoop("QUEUE");
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🔁 **|** The repeat mode has been set to **\`ALL\`**`)
                    .setColor("Blue")
                ]
            });
        } else if (mode === 2) {
            if (player.loop === "TRACK") return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🔂 **|** The repeat mode is already set to **\`ONE\`**")
                    .setColor("Yellow")
                ]
            });
            player.setLoop("TRACK");
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🔂 **|** The repeat mode has been set to **\`ONE\`**`)
                    .setColor("Blue")
                ]
            });
        } else return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription(`An error occurred while updating loop mode`)
                .setColor("Red")
            ]
        });

    },
};