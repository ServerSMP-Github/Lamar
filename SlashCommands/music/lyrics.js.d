const {
  MessageEmbed
} = require("discord.js");
const player = require("../../client/player");
const axios = require("axios");

const getLyrics = (title) =>
  new Promise(async (ful, rej) => {
    const url = new URL("https://some-random-api.ml/lyrics");
    url.searchParams.append("title", title);

    try {
      const {
        data
      } = await axios.get(url.href);
      ful(data);
    } catch (error) {
      rej(error);
    }
  });

const substring = (length, value) => {
  const replaced = value.replace(/\n/g, "--");
  const regex = `.{1,${length}}`;
  const lines = replaced
    .match(new RegExp(regex, "g"))
    .map((line) => line.replace(/--/g, "\n"));

  return lines;
};

const createResponse = async (title) => {
  try {
    const data = await getLyrics(title);

    const embeds = substring(4096, data.lyrics).map((value, index) => {
      const isFirst = index === 0;

      return new MessageEmbed({
        title: isFirst ? `${data.title} - ${data.author}` : null,
        thumbnail: isFirst ? {
          url: data.thumbnail.genius
        } : null,
        description: value,
        color: "BLUE"
      });
    });

    return {
      embeds
    };
  } catch (error) {
    return new MessageEmbed({
      title: "I couldn't find any lyrics for that song",
      color: "RED"
    });
  }
};

module.exports = {
  name: "lyrics",
  description: "display lyrics for the current song or a specific song",
  options: [{
    name: "title",
    description: "specific song for lyrics",
    type: "STRING",
    required: false
  }],
  run: async (client, interaction) => {
    const title = interaction.options.getString("title");
    const sendLyrics = (songTitle) => {
      return createResponse(songTitle)
        .then((res) => {
          console.log({
            res
          });
          interaction.followUp(res);
        })
        .catch((err) => console.log({
          err
        }));
    };

    if (title) return sendLyrics(title);

    // check if music is diabled
    if (!client.config.command.music) return interaction.followUp({
      embeds: [
        new MessageEmbed()
        .setAuthor({
          name: `${client.user.username} will not be doing music anymore, please \`${client.prefix(interaction)}youtube\``
        })
        .setColor("BLUE")
      ]
    });

    if (!interaction.member.voice.channel)
      return interaction.followUp({
        embeds: [
          new MessageEmbed()
          .setDescription("Sorry, but you need to be in a voice channel to do that")
          .setColor("YELLOW")
        ]
      });

    // check if the user is in the same voice channel as the bot
    let voiceChannel = interaction.guild.me.voice.channel
    if (voiceChannel) {
      if (voiceChannel.id && interaction.member.voice.channel.id !== voiceChannel.id) return interaction.followUp({
        embeds: [
          new MessageEmbed()
          .setDescription("You are not in my voice channel")
          .setColor("YELLOW")
        ]
      });
    }


    const queue = player.getQueue(interaction.guildId);
    if (!queue?.playing)
      return interaction.followUp({
        embeds: [
          new MessageEmbed()
          .setDescription("There is nothing playing")
          .setColor("YELLOW")
        ]
      });

    return sendLyrics(queue.current.title);
  }
};
