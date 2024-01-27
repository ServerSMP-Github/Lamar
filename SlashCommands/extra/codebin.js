const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const languages = require("../../assets/api/sourcebin/languages.json");

module.exports = {
  name: "codebin",
  description: "Use the codebin to store and share code or text.",
  type: ApplicationCommandType.ChatInput,
  options: [{
      type: ApplicationCommandOptionType.String,
      name: "title",
      description: "Enter the name of the source.",
      required: true
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "language",
      description: "Specify the language used in the source.",
      required: true,
      choices: [{
          name: "None",
          value: "text"
        },
        {
          name: "JavaScript",
          value: "javascript"
        },
        {
          name: "HTML",
          value: "html"
        },
        {
          name: "Python",
          value: "python"
        },
        {
          name: "Java",
          value: "java"
        },
        {
          name: "CSS",
          value: "css"
        },
        {
          name: "SVG",
          value: "svg"
        },
        {
          name: "C#",
          value: "c#"
        },
        {
          name: "XML",
          value: "xml"
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "code",
      description: "Provide the source code or text to be stored and shared.",
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

    try {
      const codebin = await (await fetch("https://sourceb.in/api/bins", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Made By ${interaction.user.username}`,
          description: "",
          files: [
            {
              languageId: languages[language],
              name: title,
              content,
            }
          ]
        })
      })).json();

      interaction.followUp({
        content: `https://sourceb.in/${codebin.key}`,
        embeds: [
          new EmbedBuilder()
          .setTitle("Sourcebin")
          .setColor("Random")
          .setDescription(`Code:\n\`\`\`js\n${content}\n\`\`\``)
        ],
        ephemeral: true
      });
    } catch(err) {
      console.log(err)

      interaction.followUp({
        content: "Error, try again later",
        ephemeral: true
      });
    }

    // sourcebin
    //   .create(
    //     [{
    //       name: `Made By ${interaction.user.username}`,
    //       content: content,
    //       languageId: language
    //     }], {
    //       title: title
    //     }
    //   )
    //   .then((src) => {

    //   })
    //   .catch((e) => {
    //     interaction.followUp({
    //       content: "Error, try again later",
    //       ephemeral: true
    //     });
    //   });
  },
};
