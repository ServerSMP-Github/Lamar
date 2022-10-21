const rankSchema = require("../../../models/server/guild-rankcard");
const xpSchema = require("../../../models/server/xp");
const { isValidHexCode } = require("../../../assets/api/color");
const { isValidHttpUrl } = require("../../../assets/api/url");

module.exports = {
  name: "xp",
  run: async (client, message, args) => {
    const options = args[1]?.toLowerCase();
    const innerOption = args[2]?.toLowerCase();
    const innerInnerOption = args[3]?.toLowerCase();

    const xpData = await xpSchema.findOne({ Guild: message.guild.id });
    if (!xpData && ["off", "channel", "ping", "rate", "web", "message", "rankcard"].include(options)) return message.reply("XP is disabled.");

    const rankData = await rankSchema.findOne({ Guild: message.guild.id });

    if (options === "off") {
      await xpData.delete();
      if (rankData) await rankData.delete();

      return message.channel.send("Turned off xp commands/system.");
    }

    if (options === "on") {
      if (xpData) return message.reply("XP is enabled.");

      await xpData.create({
        Guild: message.guild.id,
        Channel: "false",
        Ping: false,
        WebUI: true,
        Rate: 6,
      });

      return message.channel.send("Turned on xp commands/system.");
    }

    if (options === "channel") {
      if (!["set", "remove"].includes(innerOption)) return message.reply("Invalid arguments");

      if (innerOption === "set") {
        const channel = message.mentions.channels.last();
        if (!channel) return message.reply("Please mention a channel!");

        xpData.Channel = channel.id;
        await xpData.save();

        return message.channel.send(`Turned on xp log channel at ${channel}.`);
      }

      if (innerOption === "remove") {
        if (xpData.Channel === "false") return message.reply("XP log channel was not set!");

        xpData.Channel = "false";
        await xpData.save();

        return message.channel.send("Turned off xp log channel.");
      }
    }

    if (options === "ping") {
      if (!["on", "off"].includes(innerOption)) return message.reply("Invalid arguments");

      xpData.Ping = innerOption == "on" ? true : false;
      await xpData.save();

      return message.channel.send(`Changed ping to ${innerOption}`);
    }

    if (options === "rate") {
      if (!["current", "reset", "set"].includes(innerOption)) return message.reply("Invalid arguments");

      if (innerOption === "current") return message.channel.send(`Current xp rate is ${xpData.Rate}`);

      let number = 6;

      if (innerOption === "set") {
        number = Number(innerInnerOption);

        if (!number) return message.reply("Please specify a number for the new XP rate.");
        if (!isNaN(number) === false) return message.reply("Um, that is not a number!");

        number = Math.round(number);
      }

      xpData.Rate = number;
      await xpData.save();

      return message.channel.send(innerOption == "reset" ? "XP rate is reset to the default (6)" : `Change XP rate to ${number}`);
    }

    if (options === "web") {
      if (!["on", "off"].includes(innerOption)) return message.reply("Invalid arguments");

      xpData.WebUI = innerOption == "on" ? true : false;
      await xpData.save();

      return message.channel.send(`Changed web to ${innerOption}`);
    }

    if (options === "message") {
      if (!["on", "off"].includes(innerOption)) return message.reply("Invalid arguments");

      if (xpData.Channel !== "none") return message.reply("XP messages are already on.");

      xpData.Channel = innerOption == "on" ? "false" : "none";
      await xpData.save();

      return message.channel.send(`Turned ${innerOption} XP messages`);
    }

    if (options === "rankcard") {
      if (!["color", "status", "background"].includes(innerOption)) return message.reply("Invalid arguments");

      const arguments = args[4];

      if (!rankData) await rankSchema.create({
        Guild: message.guild.id,
        ProgressOption: false,
        ProgressBar: "",
        StatusStyle: false,
        BackgroundOption: false,
        Background: "default"
      });

      if (innerOption === "color") {
        if (!["set", "reset"].includes(innerInnerOption)) return message.reply("Invalid arguments");

        if (innerInnerOption === "set") {
          if (!arguments) return message.reply("Please specify a color!\n\n**Basic colors**:\n🟢: `#008000`\n🟡: `#ffff00`\n🟠: `#ffa500`\n🔴: `#ff0000`\n🟣: `#800080`\n🔵: `#0000ff`\n⚫: `#000000`\n⚪: `#ffffff`");

          if (!isValidHexCode(color)) return message.reply("Not a valid hex color");

          rankData.ProgressOption = true;
          rankData.ProgressBar = color;
          await rankData.save();

          return message.channel.send(`Changed rankcard color to ${color}`);
        }

        if (innerInnerOption === "reset") {
          rankCard.ProgressOption = false;
          rankCard.ProgressBar = "";
          await rankCard.save();

          return message.channel.send("Reset rankcard color");
        }
      }

      if (innerOption === "status") {
        if (!["set", "reset"].includes(innerInnerOption)) return message.reply("Invalid arguments");

        if (innerInnerOption === "set") {
          if (["true", "false"].includes(arguments)) return message.reply("Invalid arguments");

          rankCard.StatusStyle = arguments == "true" ? true : false;
          await rankCard.save();

          return message.channel.send(`Changed rankcard status style to ${style}`);
        }

        if (innerInnerOption === "reset") {
          rankCard.StatusStyle = false;
          await rankCard.save();

          return message.channel.send("Reset rankcard status style");
        }
      }

      if (innerOption === "background") {
        if (!["set", "reset"].includes(innerInnerOption)) return message.reply("Invalid arguments");

        if (innerInnerOption === "set") {
          if (!isValidHttpUrl(args[4])) return message.reply("Not a valid URL!");

          rankCard.BackgroundOption = true;
          rankCard.Background = String(args[4]);
          await rankCard.save();

          return message.channel.send(`Changed rankcard background to ${args[4]}`);
        }

        if (innerInnerOption === "reset") {
          rankCard.BackgroundOption = false;
          rankCard.Background = "default";
          await rankCard.save();

          return message.channel.send("Reset rankcard background")
        }
      }
    }

  }
}