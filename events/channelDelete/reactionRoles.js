const reactionSchema = require("../../models/logs/reaction-roles");
const client = require("../../index");

module.exports = async(channel) => {
    const reactionData = await reactionSchema.findOne({ Channel: channel.id });

    if (reactionData) await reactionData.deleteOne();
}