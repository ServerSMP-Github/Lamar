const rankCardSchema = require('../../models/server/guild-rankcard');
const client = require("../../index");

module.exports = async(guild) => {
    const rankCardData = await rankCardSchema.findOne({ Guild: guild.id });

    if (rankCardData) await rankCardData.delete();
}