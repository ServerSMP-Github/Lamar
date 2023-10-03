const antiInviteSchema = require('../../models/moderator/anti-invite');
const client = require("../../index");

module.exports = async(guild) => {
    const antiInviteData = await antiInviteSchema.findOne({ Guild: guild.id });

    if (antiInviteData) await antiInviteData.deleteOne();
}