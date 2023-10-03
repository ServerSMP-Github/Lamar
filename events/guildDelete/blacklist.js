const blacklistSchema = require('../../models/management/blacklist');
const client = require("../../index");

module.exports = async(guild) => {
    const blacklistData = await blacklistSchema.findOne({ Server: guild.id });

    if (blacklistData) await blacklistData.deleteOne();
}