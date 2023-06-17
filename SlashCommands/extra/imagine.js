const { CommandInteraction, Client, ActionRowBuilder, AttachmentBuilder, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const { generateImage } = require("../../assets/api/ai");

module.exports = {
    name: 'imagine',
    description: 'Turn your imagination into visuals with AI (while killing my computer!)',
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "prompt",
        description: "The prompt for the image",
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        if (process.platform !== 'linux') return interaction.followUp({ content: "This command only works if the bot is running on Linux!" });

        const prompt = interaction.isButton() ? interaction.customId : interaction.options.getString("prompt");

        const { file } = await generateImage(interaction.id, prompt);

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(prompt)
                .setImage("attachment://image.jpg")
            ],
            files: [
                new AttachmentBuilder(file, "image.jpg")
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId(prompt)
                    .setLabel("Try again!")
                    .setStyle(ButtonStyle.Primary)
                ),
            ],
        });

    },
};