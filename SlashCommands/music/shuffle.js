const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const musicSchema = require("../../models/server/music.js");

module.exports = {
    name: "shuffle",
    description: "Sets shuffle mode",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "mode",
        description: "Shuffle type",
        type: ApplicationCommandOptionType.Boolean,
        required: true
    }],
    run: async (client, interaction) => {

        if (client.config.music.enabled === false || (client.config.music.whitelist && client.config.music.whitelist.includes(interaction.guild.id) === false)) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `${client.user.username} will not be doing music anymore, please use \`youtube together\`` })
                .setColor("Blue")
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

        let musicData = await musicSchema.findOne({ Guild: interaction.guild.id });
        if (!musicData) musicData = await musicSchema.create({ Guild: interaction.guild.id, Skip: false, Shuffle: false });

        const mode = interaction.options.getBoolean("mode");

        if (mode === true) {
            if (musicData.Shuffle === true) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🔁 **|** The shuffle mode is already set to **\`ON\`**")
                    .setColor("Yellow")
                ]
            });

            musicData.Shuffle = true;
            await musicData.save();

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🔁 **|** The shuffle mode has been set to **\`ON\`**`)
                    .setColor("Blue")
                ]
            });
        } else if (mode === false) {
            if (musicData.Shuffle === false) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("▶ **|** The shuffle mode is already set to **\`OFF\`**")
                    .setColor("Yellow")
                ]
            });

            musicData.Shuffle = false;
            await musicData.save();

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`▶ **|** The shuffle mode has been set to **\`OFF\`**`)
                    .setColor("Blue")
                ]
            });
        } else return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription(`An error occurred while updating shuffle mode`)
                .setColor("Red")
            ]
        });

    },
};