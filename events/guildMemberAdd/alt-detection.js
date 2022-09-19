const altSchema = require('../../models/moderator/altDetectionSystem');
const client = require("../../index");

module.exports = async(member) => {
    const altData = await altSchema.findOne({ Guild: member.guild.id });

    if (!altData) return;

    const createAt = new Date(member.user.createdAt).getTime();
    const difference = Date.now() - createAt;

    if (difference < 172800000) {
        if (altData.Message === true) member.send(`You have been detected as an alt account. (type: ${altData.Type}, account is younger then 2 days) `);

        if (altData.Type === "ban") member.ban({ reason: "Alt account" });
        else if (altData.Type === "kick") member.kick("Alt account detected.");
    }
}