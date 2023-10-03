const modlogsSchema = require('../../models/logs/modlogs');
const client = require("../../index");

module.exports = async(guild) => {
    const modlogsData = await modlogsSchema.findOne({ Guild: guild.id });

    if (modlogsData) await modlogsData.deleteOne();
}