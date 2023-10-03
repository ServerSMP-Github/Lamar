const pollSchema = require('../../models/server/poll');
const client = require("../../index");

module.exports = async(guild) => {
    const pollData = await pollSchema.findOne({ Guild: guild.id });

    if (pollData) await pollData.deleteOne();
}