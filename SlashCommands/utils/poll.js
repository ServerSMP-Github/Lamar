const { EmbedBuilder, ActionRowBuilder, ChannelType, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle, ButtonBuilder } = require('discord.js');
const Schema = require('../../models/server/poll-cmd');

module.exports = {
    name: 'poll',
    description: 'Create a poll with multiple options.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'title',
            description: 'The title of poll',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'choice1',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'choice2',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'choice3',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice4',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice5',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice6',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice7',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice8',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice9',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'choice10',
            description: 'A choice',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'destination',
            description: 'The channel for the poll',
            type: ApplicationCommandOptionType.Channel,
            required: false,
            channelTypes: [ChannelType.GuildText],
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const title = interaction.options.getString('title');
        if (title.length > 255) return interaction.followUp({ content: "Keep the title under 255 characters", ephemeral: true });

        const array = [];
        for (let i = 1; i <= 10; i++) array.push(interaction.options.getString(`choice${i}`));

        const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

        const embed = new EmbedBuilder()
            .setTitle(`**${title}**`)
            .setColor("Random")
            .setTimestamp();

        const buttons = array.reduce((acc, element, i) => {
            if (!element || element.length > 1023) return acc;

            embed.addFields({
                value: '\u200b',
                name: `${emoji[i]} ${element}`,
            });

            acc.push(
                new ButtonBuilder()
                .setCustomId(`poll${i + 1}`)
                .setLabel('0')
                .setEmoji(`${emoji[i]}`)
                .setDisabled(false)
                .setStyle(ButtonStyle.Primary)
            )

            return acc;
        }, []);

        let index = 0;
        const rows = [];
        while (index < buttons.length) {
            rows.push(new ActionRowBuilder());
            rows[rows.length - 1].addComponents(buttons.slice(index, index + 5));
            index += 5;
        }

        const channelOption = interaction.options.getChannel('destination');

        const content = {
            content: `📊 ${interaction.user} started a poll`,
            embeds: [embed],
            components: rows
        };

        let message = null;
        if (channelOption) message = await channel.send(content);
        else message = await interaction.followUp(content);

        if (channelOption) interaction.followUp({ content: "Created poll" });

        await Schema.create({ message: message.id });
    },
};