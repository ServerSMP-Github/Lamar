const { Message, Client, EmbedBuilder } = require("discord.js");
const SchemaNSFW = require("../../models/server/nsfw");
const { readdirSync } = require("fs");

module.exports = {
    name: "help",
    description: "List all the commands.",
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
        const categories = [];

        const ignored = ["nsfw"];

        const nsfwData = await SchemaNSFW.findOne({ Guild: message.guild.id }).exec();

        if (nsfwData) nsfwData.Channels !== undefined ? nsfwData.Channels.includes(message.channel.id) ? ignored.splice(ignored.indexOf("nsfw"), 1) : null : ignored.splice(ignored.indexOf("nsfw"), 1);
        else message.channel.nsfw === true ? ignored.splice(ignored.indexOf("nsfw"), 1) : null;

        readdirSync("./commands/").forEach((dir) => {
          if (ignored.includes(dir.toLowerCase())) return;

          const name = `${[dir.toLowerCase()]}`;
          let cats = new Object();

          cats = {
            name: name,
            value: `\`${prefix}help ${dir.toLowerCase()}\``,
            inline: true,
          };

          categories.push(cats);
        });

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle("📬 Need help?")
            .setDescription(`\`\`\`js\nPrefix: ${prefix}\nExtra information: If you seen error or bugs please use ${prefix}report to report it! 'If commands don't work the bot may need more perms!'\`\`\`\n> To check out a category, use command \`${prefix}help [category-name]\``)
            .addFields(categories)
            .setFooter({
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({
                dynamic: true,
              })
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(color)
          ]
        });
      } else {
        const cots = [];
        const catts = [];

        readdirSync("./commands/").forEach((dir) => {
          if (dir.toLowerCase() !== arg) return;
          const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));

          const cmds = commands.map((command) => {
            const file = require(`../../commands/${dir}/${command}`);

            if (!file.name) return "No command name.";

            const name = file.name.replace(".js", "");

            const des = client.commands.get(name).description;

            const obj = {
              cname: `\`${name}\``,
              des,
            };

            return obj;
          });

          let dota = new Object();

          cmds.map((co) => {
            dota = {
              name: `${cmds.length === 0 ? "In progress." : co.cname}`,
              value: co.des ? co.des : "No Description",
              inline: true,
            };

            catts.push(dota);
          });

          cots.push(dir.toLowerCase());
        });

        const command = client.commands.get(arg) || client.commands.find((c) => c.aliases && c.aliases.includes(arg));

        if (cots.includes(arg)) return message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle(`__${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Commands!__`)
            .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ban\`.\n\n`)
            .addFields(catts)
            .setColor(color)
          ]
        });

        if (!command) return message.channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
            .setColor("Red")
          ]
        });

        return message.channel.send({
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
              text: `Requested by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({
                dynamic: true,
              })
            })
            .setTimestamp()
            .setColor(color)
          ]
        });
      }
    },
};