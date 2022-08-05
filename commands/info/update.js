const {
  Message,
  Client,
  MessageActionRow,
  MessageButton,
  EmbedBuilder,
  MessageAttachment
} = require('discord.js');
const fetch = require('axios');

module.exports = {
  name: 'update',
  description: "The patch notes for this update.",
  usage: "[ current | latest ]",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args[0]?.toLowerCase();

    if (query === "current") {
      const version = client.config.bot.info.version;
      try {
        fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/patch-notes-${version}.json`)
          .then(body => message.channel.send({
            embeds: [
              new EmbedBuilder()
              .setTitle(body.data.Title)
              .setDescription(body.data.Description.join("\n"))
              .setColor("Random")
              .setImage(body.data.Image)
            ]
          }));
      } catch (err) {
        return message.channel.send(`Unable to get patch notes for version ${version}, sorry.`)
      }

    } else if (query === "latest") {
      try {
        fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/version.json`)
          .then(async (ver) => {
            fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/patch-notes-${await ver.data.version}.json`)
              .then(body => message.channel.send({
                embeds: [
                  new EmbedBuilder()
                  .setTitle(body.data.Title)
                  .setDescription(body.data.Description.join("\n"))
                  .setColor("Random")
                  .setImage(body.data.Image)
                ]
              }));
          })
      } catch (err) {
        return message.channel.send(`Unable to get latest patch notes, sorry.`)
      }

    } else {
      const ver = args[0];
      if (!ver) {
        fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/list.json`)
          .then(body => message.channel.send({
            embeds: [
              new EmbedBuilder()
              .setColor("Random")
              .setTitle("Update - Help")
              .setDescription(`Only \`current\` or \`latest\` or \`specify a version\` exist as the query.\n**Versions:**\n\`\`\`\n${body.data.list.join("\n")}\`\`\``)
            ]
          }));
      } else {
        fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/list.json`)
          .then(body => {
            if (body.data.oldsystem.includes(ver)) {
              fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/patch-notes-${ver}.txt`)
                .then(body2 => {
                  message.channel.send({
                    content: body2.data
                  });
                });
            } else if (body.data.newsystem.includes(ver)) {
              fetch(`https://raw.githubusercontent.com/Prince527GitHub/ServerSMP/ServerSMP-BOT-(Change-Log)/patch-notes-${ver}.json`)
                .then(body3 => message.channel.send({
                  embeds: [
                    new EmbedBuilder()
                    .setTitle(body3.data.Title)
                    .setDescription(body3.data.Description.join("\n"))
                    .setColor("Random")
                    .setImage(body3.data.Image)
                  ]
                }));
            } else return message.channel.send("Version not found.");
          });
      }
    }
  }
}
