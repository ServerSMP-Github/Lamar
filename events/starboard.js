const starboardSchema = require("../models/server/starboard");
const {
    starboard
} = require('simply-djs');
const client = require('../index');

client.on('messageReactionAdd', async (reaction, user) => {
    starboardSchema.findOne({
        Guild: reaction.message.guildId
    }, async (err, data) => {
        if (data) {
            starboard(client, reaction, {
                event: 'messageReactionAdd',
                chid: data.Channel,
            });
        }
    });
});

client.on('messageReactionRemove', async (reaction, user) => {
    starboardSchema.findOne({
        Guild: reaction.message.guildId
    }, async (err, data) => {
        if (data) {
            starboard(client, reaction, {
                event: 'messageReactionRemove',
                chid: data.Channel,
            });
        }
    });
});

client.on('messageDelete', async (message) => {
    starboardSchema.findOne({
        Guild: message.guild.id
    }, async (err, data) => {
        if (data) {
            starboard(client, message, {
                event: 'messageDelete',
                chid: data.Channel,
            });
        }
    });
});