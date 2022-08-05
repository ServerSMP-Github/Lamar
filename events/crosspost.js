const Schema = require('../models/server/crosspost.js');
const client = require('../index');

client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
        if (!data) return;
        if (message.channel.type === "GUILD_NEWS") message.crosspost();
    });
});