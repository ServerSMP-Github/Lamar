const xpSchema = require('../../models/server/xp');
const client = require("../../index");

module.exports = async(guild) => {
    const xpData = await xpSchema.findOne({ Guild: guild.id });

    if (xpData) await xpData.delete();
}