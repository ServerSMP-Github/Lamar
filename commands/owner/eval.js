const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'eval',
    usage: '[ code ]',
    description : "Evaluate a given code!",
    botPermission: ["EMBED_LINKS"],
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if (!client.config.command.owner.eval) return message.reply("This command is disabled!");
        try {
            const code = args.join(" ");
            if (!code) {
              return message.channel.send("What do you want to evaluate?");
            }
            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            let embed = new EmbedBuilder()
              .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
              .addField("Input", `\`\`\`${code}\`\`\``)
              .addField("Output", `\`\`\`${evaled.replace(new RegExp(client.token.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi"), "Nice try you bot!")}\`\`\``)
              .setColor("BLUE");

            message.channel.send({ embeds: [embed] });
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
          }
    }
}
