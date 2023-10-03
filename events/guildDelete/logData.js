const logDataSchema = require('../../models/logs/logsData');
const client = require("../../index");

module.exports = async(guild) => {
    const logDataData = await logDataSchema.findOne({ Guild: guild.id });

    if (logDataData) await logDataSchema.deleteOne();
}