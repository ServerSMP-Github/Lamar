const profileSchema = require("../models/user/profile");
const schema = require("../models/server/xp");
const Levels = require('discord-xp');
const client = require("../index");

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  async function guild() {
    schema.findOne({
      Guild: message.guild.id
    }, async (err, data) => {
      if (!data) return;
      if (data) {
        const randomXp = Math.floor(Math.random() * Number(data.Rate)) + 1;
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
        if (hasLeveledUp) {
          if (data.Channel !== "false") {
            const channel = message.guild.channels.cache.get(data.Channel);
            const user = await Levels.fetch(message.author.id, message.guild.id);
            if (data.Ping === false) return channel.send(`${message.author.username} leveled up to ${user.level}! Keep it going!`);
            channel.send(`${message.author} leveled up to ${user.level}! Keep it going!`);
          } else {
            if (data.Channel === "none") return;
            const user = await Levels.fetch(message.author.id, message.guild.id);
            if (data.Ping === false) return message.channel.send(`${message.author.username} leveled up to ${user.level}! Keep it going!`);
            message.channel.send(`${message.author} leveled up to ${user.level}! Keep it going!`);
          }
        }
      }
    });
  }

  guild();

  async function profile() {
    profileSchema.findOne({
      User: message.author.id
    }, async (err, data) => {
      if (!data) {
        data = new profileSchema({
          User: message.author.id,
          Name: message.author.username,
          Description: "",
          Status: "",
          Statustype: "auto",
          Descriminator: String(message.author.discriminator),
          Background: "minecraft",
          Owner: false,
          Level: 0,
          XP: 0,
          MaxXP: 0,
        });
      }

      const randomXp = Math.floor(Math.random() * 5) + 1;
      if (data.Level === 0 && data.XP === 0) {
        data.XP = Number(data.XP) + 10;
      } else data.XP = Number(data.XP) + randomXp;
      if (data.MaxXP === 0) data.MaxXP = Number(data.XP) * 5;

      if (data.XP >= data.MaxXP) {
        data.Level = Number(data.Level) + 1;
        data.XP = 0;
        data.MaxXP = Number(data.MaxXP) * 5;
      }

      data.save();
    });
  }

  profile();
});