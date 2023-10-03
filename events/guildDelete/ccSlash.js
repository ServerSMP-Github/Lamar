const ccSlashSchema = require('../../models/server/cc-slash');
const client = require("../../index");

module.exports = async(guild) => {
    const ccSlashData = await ccSlashSchema.findOne({ guildId: guild.id });

    if (ccSlashData) await ccSlashData.deleteOne();
}