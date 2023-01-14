const blackWordsSchema = require('../../models/moderator/blackwords');
const client = require("../../index");

module.exports = async(guild) => {
    const blackWordsData = await blackWordsSchema.findOne({ Guild: guild.id });

    if (blackWordsData) await blackWordsData.delete();
}