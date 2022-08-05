const client = require('../index');
const Schema = require('../models/moderator/altDetectionSystem');
const ms = require('ms');
const timeSpan = ms('2 days');

client.on("guildMemberAdd", (member) => {
    Schema.findOne({ Guild: member.guild.id }, async(err, data) => {
        if (!data) return;
        if (data) {
            const createAt = new Date(member.user.createdAt).getTime();
            const difference = Date.now() - createAt;
            
            if (difference < timeSpan) {
                if (data.Message === true) member.send(`You have been detected as an alt account. (type: ${data.Type}, account is younger then 2 days) `);
                if (data.Type === "ban") {
                    member.ban({ reason: "Alt account" });
                } else if (data.Type === "kick") {
                    member.kick("Alt account detected.");
                }
            }
        }
    });
});