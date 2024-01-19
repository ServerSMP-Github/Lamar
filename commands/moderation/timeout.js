const { Message, Client, PermissionsBitField } = require('discord.js');
const { parseDuration } = require("../../assets/api/time");

module.exports = {
  name: 'timeout',
  usage: '[user] [time]',
  description: "Temporarily mute players on Discord.",
  userPermission: [PermissionsBitField.Flags.ManageMessages],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const time = args.slice(1).join(' ');

    if (!time) return message.channel.send('please specify the time!');

    const user = message.mentions.users.first();
    const milliseconds = parseDuration(time);

    if (!user) return message.channel.send('no user specified');

    const guildMember = message.guild.members.cache.get(user.id);

    if (guildMember.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("Can't mute this user.");

    if (!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) return message.channel.send('invalid time or it isn\'t 10s-28d');

    guildMember.timeout(milliseconds);

    message.reply(`${user.username} has been timed out for \`${time}\`!`);
  }
}
