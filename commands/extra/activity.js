const {
  Message,
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageAttachment
} = require("discord.js");
const fetch = require('axios');

module.exports = {
  name: 'activity',
  description: "Do activitys in discord.",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const channel = message.member.voice.channel
    if (channel) {
      const activitys = new MessageEmbed()
        .setTitle("Activity")
        .setDescription("Here is a list of options!\n```\nyoutube\nchess\nchess-dev\nbetrayal\nfishing\npoker\nscrabble\ncrossword\ndrawing\nawkword\nspellcast\ncheckers\nscribble```")
        .setColor("RANDOM")
      if (!args[0]) return message.reply({
        embeds: [activitys]
      });
      const query = args[0].toLowerCase();
      if (query === "youtube") {
        return ActiviteFetch("880218394199220334", channel, "870909668090851399", "Youtube Together", "RED", "Click the button below to watch youtube in vc", client, message);
      } else if (query === "chess") {
        return ActiviteFetch("832012774040141894", channel, "♟️", "Chess In The Park", "WHITE", "Click the button below to play chess in vc", client, message);
      } else if (query === "betrayal") {
        return ActiviteFetch("773336526917861400", channel, "🤫", "Betrayal.io", "BLUE", "Click the button below to play betrayal (amoug us clone) in vc", client, message);
      } else if (query === "fishing") {
        return ActiviteFetch("814288819477020702", channel, "🐟", "Fishington", "#55acee", "Click the button below to play fishington in vc", client, message);
      } else if (query === "poker") {
        return ActiviteFetch("755827207812677713", channel, "♠️", "Poker Night", "WHITE", "Click the button below to play poker in vc", client, message);
      } else if (query === "scrabble") {
        return ActiviteFetch("879863686565621790", channel, "🎲", "Letter Tile", "#a46df9", "Click the button below to play scrabble in vc", client, message);
      } else if (query === "crossword") {
        return ActiviteFetch("879863976006127627", channel, "📰", "Word Snacks", "#b9ffb7", "Click the button below to play crossword in vc", client, message);
      } else if (query === "drawing") {
        return ActiviteFetch("878067389634314250", channel, "🖊️", "Doodle Crew", "#fdc25d", "Click the button below to play drawing in vc", client, message);
      } else if (query === "awkword") {
        return ActiviteFetch("879863881349087252", channel, "🃏", "Awkword", "#824529", "Click the button below to play awkword in vc", client, message);
      } else if (query === "spellcast") {
        return ActiviteFetch("852509694341283871", channel, "🪄", "SpellCast", "#172e6a", "Click the button below to play CandyCrush in vc", client, message);
      } else if (query === "checkers") {
        return ActiviteFetch("832013003968348200", channel, "👑", "Checkers In The Park", "#d63e3d", "Click the button below to play checkers in vc", client, message);
      } else if (query === "scribble") {
        return ActiviteFetch("902271654783242291", channel, "👑", "Sketch Heads", "#ffd443", "Click the button below to play scribble in vc", client, message);
      } else return message.reply({
        embeds: [activitys]
      });
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
          .setTitle("You must be connected to a voice channel to use this command!")
          .setColor("#202225")
        ]
      });
    }
  },
};

async function ActiviteFetch(code, channel, emoji, name, color, description, client, message) {
  fetch({
    method: "post",
    url: `https://discord.com/api/v8/channels/${channel.id}/invites`,
    data: {
      max_age: 86400,
      max_uses: 0,
      target_application_id: code,
      target_type: 2,
      temporary: false,
      validate: null
    },
    headers: {
      "Authorization": `Bot ${client.token}`,
      "Content-Type": "application/json"
    }
  }).then(invite => {
    if (!invite.data.code) return message.channel.send({
      embeds: [
        new MessageEmbed()
        .setTitle("I was unable to start the activite session!")
        .setColor(color)
      ]
    });

    message.channel.send({
      embeds: [new MessageEmbed()
        .setTitle(name)
        .setDescription(description)
        .setColor(color)
      ],
      components: [new MessageActionRow().addComponents(
        new MessageButton()
        .setStyle("LINK")
        .setLabel(name)
        .setEmoji(emoji)
        .setURL(`https://discord.com/invite/${invite.data.code}`)
      )]
    });
  });
}