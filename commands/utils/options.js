const { EmbedBuilder, Message, Client, AttachmentBuilder, PermissionsBitField } = require("discord.js");

const logDataSchema = require("../../models/logs/logsData");
const cmdSchema = require("../../models/server/command");
const nqnSchema = require("../../models/server/nqn");

const { randomHexColor } = require("../../assets/api/color");
const { getFileList } = require("../../assets/api/file");

module.exports = {
  name: "options",
  usage: "[ option 1 | ] [ option 2 ] [ option 3 ] [ option 4 ] { To get a list to the options do the command without options (aka: {prefix}options). }",
  description: "Set up some options stuff.",
  userPermission: [PermissionsBitField.Flags.Administrator],
  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {

    const query = args[0]?.toLowerCase();

    const optionsFiles = await getFileList(`${process.cwd()}/commands/utils/options`, { type: ".js", recursively: false });
    return optionsFiles.map((value) => {
      const file = require(value);

      query === file.name ? file.run(client, message, args) : !file.name && !query ? file.run(client, message, args) : null;
    });

    if (query === "cmd") {
      if (options === "enable") {
        const cmd = args[0];
        if (!cmd) return message.channel.send("Please specify a command")
        if (!!client.commands.get(cmd) === false) return message.channel.send("This command does not exist");
        SchemaCMD.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) return message.reply("This server does not have any commands disabled.")
          if (err) throw err;
          if (data) {
            if (data.Cmds.includes(cmd)) {
              let commandNumber;

              for (let i = 0; i < data.Cmds.length; i++) {
                if (data.Cmds[i] === cmd) data.Cmds.splice(i, 1)
              }

              await data.save()
              message.channel.send(`Enabled ${cmd}!`)
            } else return message.channel.send("That command isnt turned off.")
          }
        })
      } else if (options === "disable") {
        const cmd = args[0];
        if (!cmd) return message.channel.send("Please specify a command")
        if (!!client.commands.get(cmd) === false) return message.channel.send("This command does not exist");
        SchemaCMD.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (err) throw err;
          if (data) {
            if (data.Cmds.includes(cmd)) return message.channel.send("This command has already been disabled.");
            data.Cmds.push(cmd)
          } else {
            data = new SchemaCMD({
              Guild: message.guild.id,
              Cmds: cmd
            })
          }
          await data.save();
          message.channel.send(`Command ${cmd} has been disabled`)
        })
      } else return message.reply("Option is not correct!")

    } else if (query === "nqn") {
      if (options === "on") {
        SchemaNQN.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (data) return message.reply("NQN is allready on!");
          if (!data) {
            new SchemaNQN({
              Guild: message.guild.id,
              Users: [],
            }).save();
            return message.reply("NQN is turned on!");
          }
        });

      } else if (option === "off") {
        SchemaNQN.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (!data) return message.reply("NQN is allready off!");
          if (data) {
            data.delete();
            return message.reply("NQN is turned off!");
          }
        });

      } else return message.reply("Option is not correct!")

    } else return message.reply("Query is not correct!")
  }
}

async function shorten(url) {
  const response = await (await fetch(encodeURI(`https://api.1pt.co/addURL?long=${url}`))).json();
  if (response.status !== 201) return shorten(url);
  return response.short;
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}