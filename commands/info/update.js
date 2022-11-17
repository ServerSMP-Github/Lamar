const { Message, Client, EmbedBuilder } = require('discord.js');
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

    const update = (await fetch(`https://raw.githubusercontent.com/${client.config.bot.repo.user}/${client.config.bot.repo.repo}/${client.config.bot.repo.branche}/updates.json`)).data

    const version = query == "current" ? client.config.bot.info.version : query == "latest" ? update.latest : update.versions.includes(query) ? query : null;

    if (version === null) return message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setColor("Random")
        .setTitle("Update - Help")
        .setDescription(`Only \`current\` or \`latest\` or \`specify a version\` as the query.\n**Versions:**\n\`\`\`\n${update.versions.join("\n")}\`\`\``)
      ]
    });

    const notes = (await fetch(`https://raw.githubusercontent.com/${client.config.bot.repo.user}/${client.config.bot.repo.repo}/${client.config.bot.repo.branche}/json/update-${version}.json`)).data;

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(notes.Title)
        .setDescription(notes.Description.join("\n"))
        .setColor("Random")
        .setImage(notes.Image)
      ]
    });
  }
}
