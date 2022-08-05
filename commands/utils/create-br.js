const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const Nuggies = require('nuggies');

module.exports = {
    name: 'create-br',
    description : "Creates button role!",
    usage: "[ description (optional) ]",
    userPermission: ['MANAGE_GUILD'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const brmanager = new Nuggies.buttonroles();
        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setTitle("Button Roles - Documentation")
                .addField("Basic Usage", "Send messages in `roleID color label emoji` syntax! Once finished say `done`.")
                .addField("Colors", "`SECONDARY` = 🌑 (gray)\n`DANGER` = 🔴 (red)\n`PRIMARY` = 🔵 (blue)\n`SUCCESS` = 🟢 (green)")
                .setImage("https://serversmp-api.herokuapp.com/upload/1/prince/Discord_LcJ2QdcaHX.png")
                .setColor("RANDOM")
            ]
        });

        /**
         * @param {Message} m
         */
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, max: 25, time: 600000 });

        collector.on('collect', async (msg) => {
            if (!msg.content) return message.channel.send('Invalid syntax');
            if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');
            const colors = ['SECONDARY', 'DANGER', 'PRIMARY', 'SUCCESS'];
            if (!msg.content.split(' ')[0].match(/[0-9]{18}/g) || !colors.includes(msg.content.split(' ')[1])) return message.channel.send('Invalid syntax');

            const role = msg.content.split(' ')[0];
            // const role = message.guild.roles.cache.get(roleid);
            if (!role) return message.channel.send('Invalid role');

            const color = colors.find(color => color == msg.content.split(' ')[1]);
            if (!color) return message.channel.send('Invalid color');

            const label = msg.content.split(' ').slice(2, msg.content.split(' ').length - 1).join(' ');

            const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

            const final = {
                role, color, label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
            };
            brmanager.addrole(final);
        });

        collector.on('end', async (msgs, reason) => {
            if (reason == 'DONE') {
                // let text = 'Click on the buttons to get the specific role or vice-versa';
                // if (args.length === 1) {
                //     if (isNaN(args[0])) {
                //         text = (await message.channel.messages.fetch(args[0])).content;
                //     } else text = args.join(' ');
                // } else if (args.length > 1) text = args.join(' ');

                const embed = new MessageEmbed()
                    .setTitle('Button roles!')
                    .setDescription(args.length === 1 ? isNaN(args[0]) === true ? (await message.channel.messages.fetch(args[0])).content : args.join(' ') : args.length > 1 ? args.join(' ') : 'Click on the buttons to get the specific role or vice-versa')
                    .setColor('RANDOM')
                    .setTimestamp();
                Nuggies.buttonroles.create(client, { content: embed, role: brmanager, channelID: message.channel.id });
            } else if (reason == 'time') return message.channel.send("Took to long to complete.");
        });
    }
}
