const nsfwSchema = require('../../models/server/nsfw');
const client = require("../../index");

module.exports = async(guild) => {
    const nsfwData = await nsfwSchema.findOne({ Guild: guild.id });

    if (nsfwData) await nsfwData.delete();
}