const crosspostSchema = require('../../models/server/crosspost');
const client = require("../../index");

module.exports = async(guild) => {
    const crosspostData = await crosspostSchema.findOne({ Guild: guild.id });

    if (crosspostData) await crosspostData.deleteOne();
}