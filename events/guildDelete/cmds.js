const cmdSchema = require('../../models/server/command');
const client = require("../../index");

module.exports = async(guild) => {
    const cmdData = await cmdSchema.findOne({ Guild: guild.id });

    if (cmdData) await cmdData.deleteOne();
}