const {
  Client,
  CommandInteraction,
  MessageEmbed
} = require("discord.js");
const sourcebin = require("sourcebin_js");
const fetch = require("axios");

module.exports = {
  name: "codebin",
  description: "Bin code or text.",
  options: [{
      name: "serversmp",
      description: "ServerSMP - CodeBin",
      type: "SUB_COMMAND",
      options: [{
          name: "code",
          description: "What you want to bin?",
          type: "STRING",
          required: true
        },
      ],
    },
    {
      name: "hastebin",
      description: "Haste Bin",
      type: "SUB_COMMAND",
      options: [{
          type: "STRING",
          name: "title",
          description: "What is the name of the source?",
          required: true
        },
        {
          type: "STRING",
          name: "language",
          description: "What is the language in the source?",
          required: true,
          choices: [{
              name: "None",
              value: "NONE"
            },
            {
              name: "Java Script",
              value: "JavaScript"
            },
            {
              name: "Html",
              value: "HTML"
            },
            {
              name: "Python",
              value: "Python"
            },
            {
              name: "Java",
              value: "Java"
            },
            {
              name: "Css",
              value: "CSS"
            },
            {
              name: "SVG",
              value: "SVG"
            },
            {
              name: "C#",
              value: "C#"
            },
            {
              name: "XML",
              value: "XML"
            }
          ]
        },
        {
          type: "STRING",
          name: "code",
          description: "What's the source?",
          required: true
        }
      ],
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === "hastebin") {
      const Content = interaction.options.getString("code");
      const Title = interaction.options.getString("title");
      sourcebin
        .create(
          [{
            name: "Made By " + interaction.user.username,
            content: Content,
            languageId: args[1].value
          }], {
            title: Title
          }
        )
        .then(src => {
          let embed = new MessageEmbed()
            .setTitle(`Hastebin`)
            .setColor("RANDOM")
            .setDescription(`Code:\n\`\`\`js\n${Content}\n\`\`\``);
          interaction.followUp({
            content: src.url,
            embeds: [embed],
            ephemeral: true
          });
        })
        .catch(e => {
          interaction.followUp({
            content: `Error, try again later`,
            ephemeral: true
          });
        });
    } else if(subCommand === "serversmp") {
      const code = interaction.options.getString("code");
      fetch({
        method: 'get',
        url: `${client.config.api.serversmp}codebin/json?text=${code}`,
      }).then(async(response) => {
        if(response.status === 429) return interaction.followUp({ embeds: [
          new MessageEmbed()
            .setTitle("Rate Limit")
            .setColor("RED")
            .setDescription("Please return in 15 minutes.")
        ]});
        if(response.status === 500) return interaction.followUp({ embeds: [
          new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(response.data.url)
        ]});
        return interaction.followUp({ embeds: [
          new MessageEmbed()
            .setTitle("CodeBin")
            .setDescription(response.data.url)
            .setColor("RANDOM")
        ]});
      });
    }
  },
};
