const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const sourcebin = require("sourcebin_js");

module.exports = {
  name: "codebin",
  description: "Bin code or text.",
  type: ApplicationCommandType.ChatInput,
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
          name: "JavaScript",
          value: "JavaScript"
        },
        {
          name: "HTML",
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
          name: "CSS",
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

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const language = interaction.options.getString("language");
    const content = interaction.options.getString("code");
    const title = interaction.options.getString("title");

    sourcebin
      .create(
        [{
          name: `Made By ${interaction.user.username}`,
          content: content,
          languageId: language
        }], {
          title: title
        }
      )
      .then((src) => {
        interaction.followUp({
          content: src.url,
          embeds: [
            new EmbedBuilder()
            .setTitle("Sourcebin")
            .setColor("Random")
            .setDescription(`Code:\n\`\`\`js\n${Content}\n\`\`\``)
          ],
          ephemeral: true
        });
      })
      .catch((e) => {
        interaction.followUp({
          content: "Error, try again later",
          ephemeral: true
        });
      });
  },
};
