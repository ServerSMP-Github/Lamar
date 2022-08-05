const {
  Message,
  Client,
  MessageActionRow,
  MessageButton,
  EmbedBuilder,
  MessageAttachment
} = require("discord.js");
const fetch = require("axios");

module.exports = {
  name: 'mc-server',
  usage: '[ type ] [ ip ]',
  description: 'Get info on a MC server!',
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const type = args[0]?.toLowerCase();
    if (!type) return message.reply('Please specify a type! `java`, `bedrock`');
    if (!['java', 'bedrock'].includes(type)) return message.reply("Please specify a valid type! `java`, `bedrock`");

    const ip = args[1]?.toLowerCase();
    if (!ip) return message.reply('Please specify an IP!');

    let urlType = "https://api.mcsrvstat.us/2/";
    if (type === 'bedrock') urlType = "https://api.mcsrvstat.us/bedrock/2/";
    const url = encodeURI(`${urlType}${ip}`);
    const { data } = await fetch.get(url);

    let embed;
    let file = null
    if (data.online === false) {
      embed = new EmbedBuilder()
        .setColor('RED')
        .setTitle(`${data.hostname} is offline!`)
    } else {
      if (type === 'java') {
        const decoded = data.icon.split(',')[1];
        const buf = Buffer.from(decoded, 'base64');
        file = new MessageAttachment(buf, 'icon.png');

        embed = new EmbedBuilder()
          .setColor('RANDOM')
          .setAuthor({
            name: data.hostname,
            iconURL: 'attachment://icon.png'
          })
          .setDescription(
            [
              `**Status:** ${data.online ? 'Online' : 'Offline'}`,
              `**Hostname:** ${data.hostname}`,
              `**Version:** ${data.version}`,
              `**Players:** ${data.players.online}/${data.players.max}`,
              `**MOTD:** ${data.motd.clean}`,
              `**IP:** ${data.ip}`,
              `**Port:** ${data.port}`,
              `**Software:** ${data.software}`,
              `**Protocol:** ${data.protocol}`
            ].join('\n')
          )
      } else {
        embed = new EmbedBuilder()
          .setColor('RANDOM')
          .setAuthor({ name: data.hostname })
          .setDescription(
            [
              `**Status:** ${data.online ? 'Online' : 'Offline'}`,
              `**Hostname:** ${data.hostname}`,
              `**Version:** ${data.version}`,
              `**Players:** ${data.players.online}/${data.players.max}`,
              `**MOTD:** ${data.motd.clean}`,
              `**MAP:** ${data.map}`,
              `**IP:** ${data.ip}`,
              `**Port:** ${data.port}`,
              `**ID:** ${data.serverid}`,
              `**Gamemode:** ${data.gamemode}`,
              `**Protocol:** ${data.protocol}`
            ].join('\n')
          )
      }
    }

    if (file !== null) {
      message.channel.send({
        embeds: [embed],
        files: [file]
      });
    } else {
      message.channel.send({
        embeds: [embed]
      });
    }
  },
};