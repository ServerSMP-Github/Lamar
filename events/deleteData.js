const SchemaChatBot = require('../models/server/chatbot-channel');
const GuildRankCard = require('../models/server/guild-rankcard');
const CustomSlashCommand = require('../models/server/cc-slash');
const SchemaBlacklist = require('../models/moderator/blackwords');
const SchemaCrosspost = require('../models/server/crosspost');
const SchemaAutorole = require('../models/server/autorole');
const roleSchema = require("../models/server/roles-colors");
const SchemaModLogs = require('../models/logs/modlogs');
const SchemaGoodbye = require('../models/logs/goodbye');
const SchemaWelcome = require('../models/logs/welcome');
const prefixSchema = require('../models/server/prefix');
const SchemaGlobal = require('../models/server/global');
// const Starboard = require('../models/server/starboard');
const SchemaCMD = require('../models/server/command');
const CustomCommand = require('../models/server/cc');
const LogData = require('../models/logs/logsData');
const Schema = require('../models/logs/invites');
const xpSchema = require('../models/server/xp');
const Levels = require("discord-xp");
const client = require('../index');

client.on('guildDelete', async(guild) => {

    // Invite
    Schema.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // XP
    xpSchema.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Captcha
    // if(await client.mongo_quick.has(`captcha-${guild.id}`) === true) await client.mongo_quick.remove(`captcha-${guild.id}`);

    // NSFW
    // if(await client.mongo_quick.has(`nsfw-${guild.id}`) === true) await client.mongo_quick.remove(`nsfw-${guild.id}`);
    // if(await client.mongo_quick.has(`nsfw-ch-${guild.id}`) === true) await client.mongo_quick.remove(`nsfw-ch-${guild.id}`);

    // Chatbot
    SchemaChatBot.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Modlogs
    SchemaModLogs.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Global
    SchemaGlobal.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Prefix
    prefixSchema.findOne({ Guild : guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Blacklist
    SchemaBlacklist.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Goodbye
    SchemaGoodbye.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });
    // if (await client.mongo_quick.has(`goodbye-theme-${guild.id}`) === true) await client.mongo_quick.remove(`goodbye-theme-${guild.id}`);
    // if (await client.mongo_quick.has(`goodbye-title-${guild.id}`) === true) await client.mongo_quick.remove(`goodbye-title-${guild.id}`);
    // if (await client.mongo_quick.has(`goodbye-text-${guild.id}`) === true) await client.mongo_quick.remove(`goodbye-text-${guild.id}`);

    // Welcome
    SchemaWelcome.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // CMD
    SchemaCMD.findOne({ Guild: guild.id }, async (err, data) => {
        if(data) data.delete();
    });

    // Autorole
    SchemaAutorole.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // LogData
    LogData.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Starboard
    // Starboard.findOne({ Guild: guild.id }, async(err, data) => {
    //     if(data) data.delete();
    // });

    // RoleColors
    roleSchema.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Guild Rankcard
    GuildRankCard.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Custom Slash Command
    CustomSlashCommand.findOne({ guildId: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Custom Command
    CustomCommand.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // Crosspost
    SchemaCrosspost.findOne({ Guild: guild.id }, async(err, data) => {
        if(data) data.delete();
    });

    // XP
    Levels.deleteGuild(guild.id);

});
