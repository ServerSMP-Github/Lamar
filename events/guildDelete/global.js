const globalSchema = require('../../models/server/global');
const client = require("../../index");

module.exports = async(guild) => {
    const globalData = await globalSchema.findOne({ Guild: guild.id });

    if (globalData) await globalData.deleteOne();
}