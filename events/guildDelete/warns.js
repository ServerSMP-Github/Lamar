const warnSchema = require('../../models/moderator/warn');
const client = require("../../index");

module.exports = async(guild) => {
    const warnData = await warnSchema.findOne({ guildid: guild.id });

    if (warnData) await warnData.delete();
}