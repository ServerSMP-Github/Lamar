const SchemaChatBot = require('../models/server/chatbot-channel');
const SchemaModLogs = require('../models/logs/modlogs');
const SchemaGoodbye = require('../models/logs/goodbye');
const SchemaWelcome = require('../models/logs/welcome');
const SchemaGlobal = require('../models/server/global');
// const Schema = require('../models/logs/invites');
const { Events } = require("discord.js");
const client = require('../index');

client.on(Events.ChannelDelete, async(channel) => {

    // Goodbye
    SchemaGoodbye.findOne({ Guild: channel.guild.id, Channel: channel.id }, async(err, data) => {
        if(data) data.delete();
    })

    // Welcome
    SchemaWelcome.findOne({ Guild: channel.guild.id, Channel: channel.id }, async(err, data) => {
        if(data) {
            // if(await client.mongo_quick.has(`welcome-type-${channel.guild.id}`) === true) await client.mongo_quick.remove(`welcome-type-${channel.guild.id}`)
            // if(await client.mongo_quick.has(`welcome-theme-${channel.guild.id}`) === true) await client.mongo_quick.remove(`welcome-theme-${channel.guild.id}`)
            data.delete();
        }
    })

    // NSFW
    // if(await client.mongo_quick.has(`nsfw-ch-${channel.guild.id}`) === true) {
    //     if(await client.mongo_quick.get(`nsfw-ch-${channel.guild.id}`) === channel.id) {
    //         await client.mongo_quick.remove(`nsfw-ch-${channel.guild.id}`)
    //     }
    // }

    // Chatbot
    SchemaChatBot.findOne({ Guild: channel.guild.id, Channel: channel.id }, async(err, data) => {
        if(data) data.delete();
    })

    // Modlogs
    SchemaModLogs.findOne({ Guild: channel.guild.id, Channel: channel.id }, async(err, data) => {
        if(data) data.delete();
    })

    // Global
    SchemaGlobal.findOne({ Guild: channel.guild.id, Channel: channel.id }, async(err, data) => {
        if(data) data.delete();
    })

    // Invite
    // Schema.findOne({ Guild: channel.guild.id, Channel: channel.id }, async(err, data) => {
        // if(data) data.delete();
    // })

    // XP

});
