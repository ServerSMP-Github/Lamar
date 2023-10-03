const welcomeSchema = require('../../models/logs/welcome');
const client = require("../../index");

module.exports = async(guild) => {
    const welcomeData = await welcomeSchema.findOne({ Guild: guild.id });

    if (welcomeData) await welcomeData.deleteOne();
}