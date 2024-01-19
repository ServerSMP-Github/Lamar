const { Message, Client, EmbedBuilder } = require("discord.js");
const { getFileList } = require("../../assets/api/file");
const SchemaNSFW = require("../../models/server/nsfw");
const { readdirSync } = require("fs");

module.exports = {
    name: "help",
    description: "List all available commands.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
      const prefix = await client.prefix(message);

      const color = message.guild.members.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.members.me.displayHexColor;

      const arg = args[0]?.toLowerCase();

      if (!arg) {
        const ignored = ["nsfw"];
        const nsfwData = await SchemaNSFW.findOne({ Guild: message.guild.id }).exec();
        if (nsfwData) nsfwData.Channels !== undefined ? nsfwData.Channels.includes(message.channel.id) ? ignored.splice(ignored.indexOf("nsfw"), 1) : null : ignored.splice(ignored.indexOf("nsfw"), 1);
        else message.channel.nsfw === true ? ignored.splice(ignored.indexOf("nsfw"), 1) : null;

        const categories = readdirSync("./commands/").filter((dir) => !ignored.includes(dir.toLowerCase()))
          .map((dir) => ({
            name: `${[dir.toLowerCase()]}`,
            value: `\`${prefix}help ${dir.toLowerCase()}\``,
            inline: true
          }));

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle("📬 Need help?")
            .setDescription(`\`\`\`js\nPrefix: ${prefix}\`\`\`\n> To check out a category, use command \`${prefix}help [category-name]\``)
            .addFields(categories)
            .setFooter({
              text: `Requested by ${message.author.username}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
          ]
        });
      }

      const dirs = await readdirSync(`${process.cwd()}/commands`);
      if (dirs.includes(arg)) {
        const commands = await getFileList(`${process.cwd()}/commands/${arg}`, { type: ".js", recursively: false });

        const cmds = commands.map((command) => {
          const file = require(command);

          const name = file?.name?.replace?.(".js", "");
          const description = file?.description;

          return {
            name: `\`${commands.length === 0 ? "In progress." : name}\``,
            value: description ? description : "No Description",
            inline: true,
          };
        });

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle(`__${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Commands!__`)
            .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ban\`.\n\n`)
            .addFields(cmds)
            .setColor(color)
          ]
        });
      }

      const command = client.commands.get(arg) || client.commands.find((c) => c.aliases && c.aliases.includes(arg));
      if (command) return message.channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle("Command Details:")
          .addFields([
            { name: "Command", value: command.name ? `\`${command.name}\`` : "No name for this command." },
            { name: "Aliases", value: command.aliases ? `\`${command.aliases.join("` `")}\`` : "No aliases for this command." },
            { name: "Usage", value: command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\`` },
            { name: "Command Description:", value: command.description ? command.description : "No description for this command." }
          ])
          .setFooter({
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL({
              dynamic: true,
            })
          })
          .setTimestamp()
          .setColor(color)
        ]
      });

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
          .setColor("Red")
        ]
      });
    },
};