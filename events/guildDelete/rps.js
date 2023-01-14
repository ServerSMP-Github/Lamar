const rpsSchema = require('../../models/user/rps');
const client = require("../../index");

module.exports = async(guild) => {
    const rpsData = await rpsSchema.find({ Guild: guild.id });

    if (rpsData.length > 0) await rpsSchema.deleteMany({ Guild: guild.id });
}