const nsfwSchema = require("../../models/server/nsfw");
const client = require("../../index");

module.exports = async(channel) => {
    const nsfwData = await nsfwSchema.findOne({ Guild: channel.guild.id });

    if (nsfwData && nsfwData.Channels.includes(channel.id)) {
        nsfwData.Channels = nsfwData.Channels.filter(id => id !== channel.id);

        await nsfwData.save();
    }
}