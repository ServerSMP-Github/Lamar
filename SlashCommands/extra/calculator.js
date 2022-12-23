const { Client, CommandInteraction, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { doMath } = require("../../assets/api/member");

module.exports = {
    name: 'calculator',
    description: 'Use a calculator in discord',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let buttons = [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('6')
                .setLabel('6')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('7')
                .setLabel('7')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('8')
                .setLabel('8')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('9')
                .setLabel('9')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('/')
                .setLabel('÷')
                .setStyle(ButtonStyle.Success),
            ),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('2')
                .setLabel('2')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('3')
                .setLabel('3')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('4')
                .setLabel('4')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('5')
                .setLabel('5')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('*')
                .setLabel('×')
                .setStyle(ButtonStyle.Success),
            ),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('%')
                .setLabel('%')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('.')
                .setLabel('.')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('0')
                .setLabel('0')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('1')
                .setLabel('1')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('-')
                .setLabel('-')
                .setStyle(ButtonStyle.Success),
            ),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('(')
                .setLabel('(')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId(')')
                .setLabel(')')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('+')
                .setLabel('+')
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId('=')
                .setLabel('=')
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId('reset')
                .setEmoji('🔄')
                .setStyle(ButtonStyle.Primary),
            ),
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('end')
                .setLabel('End Interaction')
                .setStyle(ButtonStyle.Danger),
            )
        ];

        let embed = new EmbedBuilder()
            .setDescription(`\`\`\`css\nPlaceholder\n\`\`\``)

        interaction.followUp({
            embeds: [embed],
            components: buttons
        });

        let user = interaction.user.id;

        let ids = [];
        let nums = [];

        for (let i = 0; i < buttons.length; i++) {
            for (let v = 0; v < buttons[i].components.length; v++) {
                ids.push(buttons[i].components[v].customId);

                if (buttons[i].components[v].style === "SECONDARY" || buttons[i].components[v].style === "SUCCESS") nums.push(buttons[i].components[v].customId)
                else continue;
            }
        }
        const filter = (interaction) => ids.includes(interaction.customId) && interaction.user.id === user;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 120000
        });

        var equation = '';

        collector.on('collect', async i => {
            if (i.user.id !== user) {
                return i.reply({
                    content: `These buttons aren't for you`,
                    ephemeral: true
                })
            }

            if (nums.includes(i.customId)) {
                await i.deferUpdate();
                equation += `${i.customId}`
                await i.editReply({
                    embeds: [embed.setDescription(`\`\`\`css\n${equation}\n\`\`\``)],
                }).catch(e => {})
            }
            if (i.customId === '=') {
                await i.deferUpdate();
                let answer = doMath(equation)
                await i.editReply({
                    embeds: [embed.setDescription(`\`\`\`css\n ${equation + ` = ${answer}`}\n\`\`\``)],
                }).catch(e => {})
                await i.followUp({
                    embeds: [embed.setDescription(`\`\`\`css\n${equation + ` = ${answer}`}\n\`\`\``)],
                    ephemeral: true
                }).catch(e => {})
            }
            if (i.customId === 'reset') {
                await i.deferUpdate();
                equation = ''
                await i.editReply({
                    embeds: [embed.setDescription(`\`\`\`css\nPlaceholder\n\`\`\``)],
                }).catch(e => {})
            }
            if (i.customId === 'end') {
                await i.deferUpdate();
                collector.stop()
            }
        });

        collector.on('end', async (i, reason) => {

            for (let i = 0; i < buttons.length; i++) {
                for (let v = 0; v < buttons[i].components.length; v++) {
                    buttons[i].components[v].setDisabled(true)
                }
            }

            if (reason == "time") {
                await interaction.editReply({
                    components: buttons
                }).catch(e => {})
            } else {
                await interaction.editReply({
                    components: buttons
                }).catch(e => {})
            }
        });

    }
};