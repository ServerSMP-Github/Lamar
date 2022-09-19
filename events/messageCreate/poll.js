const pollSchema = require('../../models/server/poll');
const client = require("../../index");

module.exports = async(message) => {
    if (!message.guild) return;

    const pollData = await pollSchema.findOne({ Guild: message.guild.id });

    if (!pollData) return;

    if (!pollData.Channels.includes(message.channel.id)) return;

    const eachLine = message.content.split('\n');

    for (const line of eachLine) {
        if (line.includes('=')) {
            const split = line.split('=');
            const emoji = split[0].trim();
            message.react(emoji);
        }
    }

}