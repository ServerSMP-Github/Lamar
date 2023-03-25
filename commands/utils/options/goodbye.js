const { isValidHttpUrl, isImageUrl } = require("../../../assets/api/url");
const goodbyeSchema = require("../../../models/logs/goodbye");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "goodbye",
  run: async(client, message, args) => {
    const options = args[1]?.toLowerCase();
    if (!["set", "remove"].includes(options)) return message.reply("Invalid arguments");

    if (options === "set") {

      const channelRegExp = /^<#!?(\d+)>$/;

      const options = {};

      const type = args[2]?.toLowerCase();
      if (!["popcat", "discord-welcome-card", "swiftcord", "discord-welcomer", "text"].includes(type)) return message.reply("Invalid type *(`popcat`, `discord-welcome-card`, `swiftcord`, `discord-welcomer` and `text`)*");

      const fields = [
        {
          name: "Package",
          value: `${type}`,
          inline: true
        }
      ]

      if (type === "discord-welcome-card") {
        const theme = args[3]?.toLowerCase();
        if (!["dark", "circuit", "code"].includes(theme)) return message.reply("Invalid theme *(`dark`, `circuit` and `code`)*");

        options.theme = theme;

        fields.push({            
          name: "Theme",
          value: `${theme}`,
          inline: true
        });

        const blur = args[4]?.toLowerCase();
        if (!["on", "off"].includes(blur)) return message.reply("Invalid blur *(`on` and `off`)*");

        const blurBoolean = blur === "on" ? true : false;

        options.blur = blurBoolean;

        fields.push({
          name: "Blur",
          value: `${blurBoolean}`,
          inline: true
        });

        const rounded = args[5]?.toLowerCase();
        if (!["on", "off"].includes(rounded)) return message.reply("Invalid rounded *(`on` and `off`)*");

        const roundedBoolean = rounded === "on" ? true : false;

        options.rounded = roundedBoolean;

        fields.push({
          name: "Rounded",
          value: `${roundedBoolean}`,
          inline: true
        });

        const border = args[5]?.toLowerCase();
        if (!["on", "off"].includes(border)) return message.reply("Invalid border *(`on` and `off`)*");

        const borderBoolean = border === "on" ? true : false;

        options.border = borderBoolean;

        fields.push({
          name: "Border",
          value: `${borderBoolean}`,
          inline: true
        });
      }

      if (type === "swiftcord") {
        const background = args[3];
        if (background && !channelRegExp.test(background)) {
          if (!isValidHttpUrl(background)) return message.reply("The URL specified is invalid.");

          if (!await isImageUrl(background)) return message.reply("The URL specified is not a image.");

          options.background = background;

          fields.push({
            name: "Background",
            value: `${background}`,
            inline: true
          });
        }
      }

      if (type === "discord-welcomer") {
        const background = args[3];
        if (background && background?.toLowerCase() !== "invisible" && !channelRegExp.test(background)) {
          if (!isValidHttpUrl(background)) return message.reply("The URL specified is invalid.");

          if (!await isImageUrl(background)) return message.reply("The URL specified is not a image.");
        }

        if (background && !channelRegExp.test(background)) {
          options.background = background;

          fields.push({
            name: "Background",
            value: `${background}`,
            inline: true
          });
        }
      }

      const channel = message.mentions.channels.last();
      if (!channel) return message.reply("Please mention a channel!");

      fields.push({
        name: "Channel",
        value: `${channel}`,
        inline: true
      });

      const goodbyeData = await goodbyeSchema.findOne({ Guild: message.guild.id });
      if (!goodbyeData) await goodbyeSchema.create({ Guild: message.guild.id, Channel: channel.id, Type: type, Options: options });
      else {
        goodbyeData.Channel = channel.id;
        goodbyeData.Type = type;
        goodbyeData.Options = options;
        goodbyeData.save();
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle("Goodbye Card")
          .setColor("Random")
          .addFields(fields)
        ]
      });
    } else if (options === "remove") {
      const goodbyeData = await goodbyeSchema.findOne({ Guild: message.guild.id })
      if (!goodbyeData) return message.reply("There is no welcome card set up for this server.");

      await goodbyeData.delete();

      return message.reply("The welcome card has been removed.");
    }
  }
}