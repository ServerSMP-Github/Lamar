const { EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');
const Schema = require('../../models/server/poll-cmd');

module.exports = {
    name: 'poll',
    description: 'Creates a poll with many options',
    options: [
        {
            name: 'title',
            description: 'The title of poll',
            type: 'STRING',
            required: true,
        },
        {
            name: 'choice1',
            description: 'A choice',
            type: 'STRING',
            required: true,
        },
        {
            name: 'choice2',
            description: 'A choice',
            type: 'STRING',
            required: true,
        },
        {
            name: 'choice3',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice4',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice5',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice6',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice7',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice8',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice9',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'choice10',
            description: 'A choice',
            type: 'STRING',
            required: false,
        },
        {
            name: 'destination',
            description: 'The channel for the poll',
            type: 'CHANNEL',
            required: false,
            channelTypes: ['GUILD_TEXT'],
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let title = interaction.options.getString('title');
        let c1 = interaction.options.getString('choice1');
        let c2 = interaction.options.getString('choice2');
        let c3 = interaction.options.getString('choice3');
        let c4 = interaction.options.getString('choice4');
        let c5 = interaction.options.getString('choice5');
        let c6 = interaction.options.getString('choice6');
        let c7 = interaction.options.getString('choice7');
        let c8 = interaction.options.getString('choice8');
        let c9 = interaction.options.getString('choice9');
        let c10 = interaction.options.getString('choice10');

        if (title.length > 255) return interaction.followUp({ content: `Keep The Title Under \`255\` Characters`, ephemeral: true });

        const array = [];
        array.push(c1);
        array.push(c2);
        array.push(c3);
        array.push(c4);
        array.push(c5);
        array.push(c6);
        array.push(c7);
        array.push(c8);
        array.push(c9);
        array.push(c10);

        const emoji = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟"
        ];

        const embed = new EmbedBuilder()
            .setTitle(`**${title}**`)
            .setColor("Random")
            .setTimestamp();

        const buttons = [];
        const rows = [];

        array.forEach((element, i) => {
            if (!element) return;

            if (element.length > 1023) return interaction.followUp({ content: `Keep The Choice ${i + 1} Under \`1023\` Characters`, ephemeral: true });

            embed.addFields({
                value: '\u200b',
                name: `${emoji[i]} ${element}`,
            });

            buttons.push({
                emoji: `${emoji[i]}`,
                label: '0',
                style: 'PRIMARY',
                custom_id: `poll${i + 1}`,
                disabled: false,
                type: 2,
            });
        });

        for (let i = 0; i < Math.ceil(buttons.length / 5); i++) {
            rows.push(new MessageActionRow());
        }

        rows.forEach((row, i) => {
            row.addComponents(buttons.slice(0 + (i * 5), 5 + (i * 5)));
        });

        let message = null;

        const content = {
            content: `📊 ${interaction.user} started a poll`,
            embeds: [embed],
            components: rows
        };

        let channel = interaction.options.getChannel('destination');
        if (channel) {
            message = await channel.send(content);
            interaction.followUp({
                content: "Created poll"
            });
        } else message = await interaction.followUp(content);

        await Schema.create({
            messageId: message.id
        });

    },
};