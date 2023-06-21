const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const config = require("./settings/settings.json");

require("./client/settings.js")(config);
require("./client/font.js")(config);

global.startSpinner = require("./assets/api/console").createSpinner("Starting BOT");
global.startSpinner.start();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember
  ],
  presence: {
    activities: [{
        name: global.statusName ? global.statusName : "Starting!",
        type: global.statusType,
    }],
    status: config.bot.status.status
  }
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.config = config;

require("./client/anticrash")(client);

require("./client/lavalink")(client);

const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

mongoose.connect(config.bot.database.mongo_main);

global.mongoStatus = null;
const colors  = require("./assets/api/console");
mongoose.connection.on("connected", () => global.mongoStatus === true ? console.log(`${colors.fgWhite("MongoDB")} ${colors.fgGreen("√")}`) : global.mongoStatus = colors.fgGreen("√"));
mongoose.connection.on("disconnected", () => global.mongoStatus === true ? console.log(`${colors.fgWhite("MongoDB")} ${colors.fgRed("×")}`) : global.mongoStatus = colors.fgRed("×"));
mongoose.connection.on("error", (err) => console.log(err));

if (config.bot.database.mongo_extra) client.apiConnection = mongoose.createConnection(client.config.bot.database.mongo_extra);

// client.ffmpeg = require("fluent-ffmpeg");

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