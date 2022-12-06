const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const sourcebin = require("sourcebin_js");

module.exports = {
  name: "codebin",
  description: "Bin code or text.",
  type: ApplicationCommandType.ChatInput,
  options: [{
      name: "serversmp",
      description: "ServerSMP - CodeBin",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
          name: "code",
          description: "What you want to bin?",
          type: ApplicationCommandOptionType.String,
          required: true
        },
      ],
    },
    {
      name: "hastebin",
      description: "Haste Bin",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
          type: ApplicationCommandOptionType.String,
          name: "title",
          description: "What is the name of the source?",
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
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
          type: ApplicationCommandOptionType.String,
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
          let embed = new EmbedBuilder()
            .setTitle(`Hastebin`)
            .setColor("Random")
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

      fetch(`${client.config.api.serversmp}codebin/json?text=${code}`)
      .then(res => res.json())
      .then(async(response) => {
        if(response.status === 429) return interaction.followUp({ embeds: [
          new EmbedBuilder()
            .setTitle("Rate Limit")
            .setColor("Red")
            .setDescription("Please return in 15 minutes.")
        ]});
        if(response.status === 500) return interaction.followUp({ embeds: [
          new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(response.data.url)
        ]});
        return interaction.followUp({ embeds: [
          new EmbedBuilder()
            .setTitle("CodeBin")
            .setDescription(response.data.url)
            .setColor("Random")
        ]});
      });
    }
  },
};
