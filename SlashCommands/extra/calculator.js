const { Client, CommandInteraction, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { doMath } = require("../../assets/api/number");

module.exports = {
    name: 'calculator',
    description: 'Access a calculator right in Discord.',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const createButton = (customId, label, style) => new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle(style);

        const createButtonGroup = (buttons) => new ActionRowBuilder().addComponents(...buttons);
        const editInteractionReply = (Interaction, content) => Interaction.editReply(content).catch(e => {});

        const buttonGroups = [
            createButtonGroup([
                createButton('6', '6', ButtonStyle.Secondary),
                createButton('7', '7', ButtonStyle.Secondary),
                createButton('8', '8', ButtonStyle.Secondary),
                createButton('9', '9', ButtonStyle.Secondary),
                createButton('/', '÷', ButtonStyle.Success),
            ]),
            createButtonGroup([
                createButton('2', '2', ButtonStyle.Secondary),
                createButton('3', '3', ButtonStyle.Secondary),
                createButton('4', '4', ButtonStyle.Secondary),
                createButton('5', '5', ButtonStyle.Secondary),
                createButton('*', '×', ButtonStyle.Success),
            ]),
            createButtonGroup([
                createButton('%', '%', ButtonStyle.Secondary),
                createButton('.', '.', ButtonStyle.Secondary),
                createButton('0', '0', ButtonStyle.Secondary),
                createButton('1', '1', ButtonStyle.Secondary),
                createButton('-', '-', ButtonStyle.Success),
            ]),
            createButtonGroup([
                createButton('(', '(', ButtonStyle.Secondary),
                createButton(')', ')', ButtonStyle.Secondary),
                createButton('+', '+', ButtonStyle.Success),
                createButton('=', '=', ButtonStyle.Primary),
                createButton('reset', '🔄', ButtonStyle.Primary),
            ]),
            createButtonGroup([
                createButton('end', 'End Interaction', ButtonStyle.Danger),
            ]),
        ];

        const buttons = buttonGroups.map(group => group.toJSON());

        const embed = new EmbedBuilder().setDescription(`\`\`\`css\nPlaceholder\n\`\`\``);

        interaction.followUp({ embeds: [embed], components: buttons });

        const ids = buttonGroups.flatMap(group => group.components.map(button => button.data.custom_id));
        const nums = buttonGroups.flatMap(group => group.components.filter(button => button.data.style === ButtonStyle.Secondary || button.data.style === ButtonStyle.Success).map(button => button.data.custom_id));

        const user = interaction.user.id;
        const filter = interaction => ids.includes(interaction.customId) && interaction.user.id === user;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        let equation = '';

        collector.on('collect', async(i) => {
            if (i.user.id !== user) return i.reply({ content: "These buttons aren't for you", ephemeral: true });

            await i.deferUpdate();

            if (nums.includes(i.customId)) {
                equation += i.customId;
                await editInteractionReply(i, { embeds: [embed.setDescription(`\`\`\`css\n${equation}\n\`\`\``)] });
            }

            if (i.customId === '=') await editInteractionReply(i, { embeds: [embed.setDescription(`\`\`\`css\n ${equation + ` = ${doMath(equation)}`}\n\`\`\``)] });

            if (i.customId === 'reset') {
                equation = '';
                await editInteractionReply(i, { embeds: [embed.setDescription(`\`\`\`css\nPlaceholder\n\`\`\``)] });
            }

            if (i.customId === 'end') collector.stop();
        });

        collector.on('end', async(i, reason) => {
            buttonGroups.forEach(group => group.components.forEach(button => button.setDisabled(true)));

            await editInteractionReply(interaction, { components: buttonGroups });
        });

    }
};