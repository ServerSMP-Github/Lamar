const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const config = require("./settings/settings.json");

require("events").EventEmitter.defaultMaxListeners = 15;

require("./client/settings.js")(config);
require("./client/font.js")(config);

global.startSpinner = require("ora")("Starting BOT").start();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
        name: "Starting!",
        type: global.statusType,
    }],
    status: config.bot.status.status
  }
});

module.exports = client;

// client.invites = new Collection(); // Where is this used.
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = config;

require("./client/anticrash")(client);

require("./client/lavalink")(client);

const mongoose = require("mongoose");

mongoose.connect(config.bot.database.mongo_main);

global.mongoStatus = null;
const colors  = require("./assets/api/console");
mongoose.connection.on("connected", () => global.mongoStatus === true ? console.log(`${colors.fgWhite("MongoDB")} ${colors.fgGreen("√")}`) : global.mongoStatus = colors.fgGreen("√"));
mongoose.connection.on("disconnected", () => global.mongoStatus === true ? console.log(`${colors.fgWhite("MongoDB")} ${colors.fgRed("×")}`) : global.mongoStatus = colors.fgRed("×"));
mongoose.connection.on("error", (err) => console.log(err));

require("discord-xp").setURL(config.bot.database.mongo_main);

const { MongoDB } = require("ark.db");
if (config.bot.database.mongo_extra) client.arkDB = new MongoDB(client.config.bot.database.mongo_extra, "ark.db");

client.ffmpeg = require("fluent-ffmpeg");

client.prefix = async function(message) {
  let custom;

  const data = await require("./models/server/prefix").findOne({ Guild: message.guild.id }).exec()
    .catch(err => console.log(err));

  if (data) custom = data.Prefix;
  else custom = config.bot.info.prefix;

  return custom;
}

require("./handler")(client);

client.login(config.bot.info.token);