const { Message, Client, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'eval',
    usage: '[ code ]',
    description : "Evaluate a given code!",
    botPermission: [PermissionsBitField.Flags.EmbedLinks],
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
            if (!code) return message.channel.send("What do you want to evaluate?");

            let eval = eval(code);
            if (typeof eval !== "string") eval = require("util").inspect(eval);

            message.channel.send({
              embeds: [
                new EmbedBuilder()
                .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
                .addField("Input", `\`\`\`${code}\`\`\``)
                .addField("Output", `\`\`\`${eval.replace(new RegExp(client.token.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi"), "Nice try you bot!")}\`\`\``)
                .setColor("BLUE")
              ]
            });
          } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${err.replace(new RegExp(client.token.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "gi"), "Nice try you bot!")}\n\`\`\``);
          }
    }
}
