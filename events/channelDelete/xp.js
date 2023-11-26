const xpSchema = require("../../models/server/xp");
const client = require("../../index");

module.exports = async(channel) => {
    const xpData = await xpSchema.findOne({ Channel: channel.id });

    if (xpData) {
        xpData.Channel = null;

        await xpData.save();
    }
}