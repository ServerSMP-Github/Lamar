const pollSchema = require("../../models/server/poll");
const client = require("../../index");

module.exports = async(channel) => {
    const pollData = await pollSchema.findOne({ Guild: channel.guild.id });

    if (pollData && pollData.Channels.includes(channel.id)) {
        pollData.Channels = pollData.Channels.filter(id => id !== channel.id);

        await pollData.save();
    }
}