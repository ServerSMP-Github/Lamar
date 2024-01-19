const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'pokedex',
  usage: "[pokemon name]",
  description: "Retrieve information on a Pokémon.",

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const name = args.join(" ");
    if (!name) return message.reply('Please provide a pokemon name to search!');

    const res = await (await fetch(`https://some-random-api.ml/pokedex?pokemon=${name}`)).json();

    if (!res?.name) return message.reply('Couldn\'t find that pokemon.');

    const evo = res.family.evolutionLine.map((w, i) => [`\`${i + 1}.\` ${w}`]);

    message.channel.send({
      embeds: [new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${res.name} | Generation: ${res.generation}`)
        .setAuthor({ name: `Type: ${res.type?.join(", ")}` })
        .setThumbnail(res.sprites.animated || res.sprites.normal || null)
        .setDescription(`\`\`\`${res.description}\`\`\``)
        .addFields([
          { name: "Gender", value: `${res.gender?.join(", ")}` },
          { name: "Species", value: `${res.species?.join(", ")}` },
          { name: "Abilities", value: `${res.abilities?.join(", ")}` },
          { name: "Egg Groups", value: `${res.egg_groups?.join(", ")}` },
          { name: "Evolution", value: `Evolution Stage: **${res.family.evolutionStage}**\n\n${evo.join("\n")}` }
        ])
      ]
    });

  }
}