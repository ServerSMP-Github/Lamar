const prefixSchema = require('../../models/server/prefix');
const client = require("../../index");

module.exports = async(guild) => {
    const prefixData = await prefixSchema.findOne({ Guild: guild.id });

    if (prefixData) await prefixData.deleteOne();
}