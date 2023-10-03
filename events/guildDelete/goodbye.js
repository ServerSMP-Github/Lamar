const goodbyeSchema = require('../../models/logs/goodbye');
const client = require("../../index");

module.exports = async(guild) => {
    const goodbyeData = await goodbyeSchema.findOne({ Guild: guild.id });

    if (goodbyeData) await goodbyeData.deleteOne();
}