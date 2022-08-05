const { Client, Collection, GatewayIntentBits } = require("discord.js");
require('events').EventEmitter.defaultMaxListeners = 15;
const config = require('./settings/settings.json');

require('./client/settings-check.js')(config);

global.startSpinner = require('ora')('Starting BOT').start();

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
  ],
  presence: {
    activities: [{
        name: "Starting!",
        type: config.bot.status.type,
    }],
    status: config.bot.status.status
  }
});
module.exports = client;

client.invites = new Collection();
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = config;

// require("./client/anticrash")(client);

// require('discord-logs')(client);

require("./client/lavalink")(client);

const mongoose = require("mongoose");

mongoose.connect(config.bot.database.mongo_main);

global.mongoStatus = null;
const chalk = require('chalk');
mongoose.connection.on('connected', () => global.mongoStatus === true ? console.log("MongoDB √") : global.mongoStatus = chalk.green("√"));
mongoose.connection.on('disconnected', () => global.mongoStatus === true ? console.log("MongoDB ×") : global.mongoStatus = chalk.red("×"));
mongoose.connection.on('error', (err) => console.log(err));

require("discord-xp").setURL(config.bot.database.mongo_main);

// const Nuggies = require('nuggies');

// Nuggies.handleInteractions(client);
// Nuggies.connect(config.bot.database.mongo_main);

const { MongoDB } = require("ark.db");
if (config.bot.database.mongo_extra) client.arkDB = new MongoDB(client.config.bot.database.mongo_extra, "ark.db");

const ffmpeg = require("fluent-ffmpeg");
client.ffmpeg = ffmpeg;

ffmpeg.setFfmpegPath("C:/ffmpeg/ffmpeg.exe");
ffmpeg.setFfprobePath("C:/ffmpeg/ffprobe.exe");

client.prefix = async function(message) {
  let custom;

  const data = await require('./models/server/prefix').findOne({
    Guild: message.guild.id
  }).exec()
  .catch(err => console.log(err));

  if (data) custom = data.Prefix;
  else custom = config.bot.info.prefix;

  return custom;
}

require("./handler")(client);

client.login(config.bot.info.token);