const { Message, Client } = require('discord.js');

module.exports = {
    name: "create-server",
    description: "Create a server using your bot.",
    owner: true,

    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args) => {
        if (!client.config.command.owner["create-server"]) return message.reply("This command is disabled!");

        const Guild = await client.guilds.create(client.bot.username, {
            channels: [
                {
                    "name": "invite"
                },
            ]
        });

        const GuildChannel = Guild.channels.cache.find(channel => channel.name == "invite");
        const Invite = await GuildChannel.createInvite({
            maxAge: 0,
            unique: true,
            reason: "Testing."
        });

        message.reply(`Here's the invite code: ${Invite.url}`);
    },
}