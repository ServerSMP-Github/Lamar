const { EmbedBuilder, Message, Client, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { chunkArray } = require("../../assets/api/array");

module.exports = {
    name: 'button-roles',
    usage: '[ description (optional) ]',
    aliases : ['br'],
    description : "Creates button roles!",
    userPermission: [PermissionsBitField.Flags.ManageGuild],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {

        let roles = [];

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Button Roles - Documentation")
                .addFields(
                    { name: "Basic Usage", value: "Send messages in `roleID color label emoji` syntax! Once finished say `done`." },
                    { name: "Colors", value: "`Secondary` = 🌑 (gray)\n`Danger` = 🔴 (red)\n`Primary` = 🔵 (blue)\n`Success` = 🟢 (green)" }
                )
                .setImage("https://api.serversmp.xyz/upload/Discord_LcJ2QdcaHX.png")
                .setColor("Random")
            ]
        });

        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, max: 25, time: 600000 });

        collector.on('collect', async (msg) => {
            if (!msg.content) return message.channel.send('Invalid syntax');

            if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');

            const colors = ['Secondary', 'Danger', 'Primary', 'Success'];
            if (!msg.content.split(' ')[0].match(/[0-9]{18}/g) || !colors.includes(msg.content.split(' ')[1])) return message.channel.send('Invalid syntax');

            const role = msg.content.split(' ')[0];
            if (!role) return message.channel.send('Invalid role');

            const color = colors.find(color => color == msg.content.split(' ')[1]);
            if (!color) return message.channel.send('Invalid color');

            const label = msg.content.split(' ').slice(2, msg.content.split(' ').length - 1).join(' ');

            const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

            const final = {
                role: role,
                color: color,
                label: label,
                emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
            };

            roles.push(final);
        });

        collector.on('end', async (msgs, reason) => {
            if (reason == 'DONE') return createBr();
            else if (reason == 'time') return message.channel.send("Took to long to complete.");
        });

        async function createBr() {
            if (!roles.length) return message.channel.send("You need at least one role.");

            const roleChunks = chunkArray(roles, 5);

            for (const roleChunk of roleChunks) {
                const row = new ActionRowBuilder();

                for (const element of roleChunk) {
                    const { role, color, label, emoji } = element;

                    const styles = {
                        'Secondary': ButtonStyle.Secondary,
                        'Danger': ButtonStyle.Danger,
                        'Primary': ButtonStyle.Primary,
                        'Success': ButtonStyle.Success
                    };

                    const style = styles[color];

                    row.addComponents(
                        new ButtonBuilder()
                        .setCustomId(`roles-${role}`)
                        .setLabel(label)
                        .setStyle(style)
                        .setEmoji(emoji)
                    );
                }
            }

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('Button roles!')
                    .setDescription(args.length === 1 ? isNaN(args[0]) === true ? (await message.channel.messages.fetch(args[0])).content : args.join(' ') : args.length > 1 ? args.join(' ') : 'Click on the buttons to get the specific role or vice-versa')
                    .setColor('Random')
                    .setTimestamp()
                ],
                components: [row]
            })

        }

    }
}
