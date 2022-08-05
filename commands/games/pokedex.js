const {
  EmbedBuilder,
  Message,
  Client,
  MessageAttachment
} = require('discord.js');
const fetch = require('axios');

module.exports = {
  name: 'pokedex',
  description: "Get information of a pokemon!",
  usage: "[ pokemon name ]",

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const pokename = args.join(" ");
    if (!pokename) return message.reply('Please provide a pokemon name to search!');

    const res = (await fetch(`https://some-random-api.ml/pokedex?pokemon=${pokename}`)).data;

    if (!res?.name) return message.reply('Couldn\'t find that pokemon.');
    else {

      const evo = res.family.evolutionLine.map((w, i) => [`\`${i + 1}.\` ${w}`]);

      message.channel.send({
        embeds: [new EmbedBuilder()
          .setColor("Random")
          .setTitle(`${res.name} | Generation: ${res.generation}`)
          .setAuthor({ name: 'Type: ' + res.type?.join(", ") })
          .setThumbnail(res.sprites.animated || res.sprites.normal || null)
          .setDescription('```' + res.description + '```')
          .addField(`Gender`, `${res.gender?.join(", ")}`)
          .addField('Species', `${res.species?.join(", ")}`)
          .addField('Abilities', `${res.abilities?.join(", ")}`)
          .addField('Egg Groups', `${res.egg_groups?.join(", ")}`)
          .addField('Evolution', `Evolution Stage: **${res.family.evolutionStage}**\n\n${evo.join("\n")}`)
        ]
      })

    }

  }
}