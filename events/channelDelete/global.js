const globalSchema = require("../../models/server/global");
const client = require("../../index");

module.exports = async(channel) => {
    const globalData = await globalSchema.findOne({ Channel: channel.id });

    if (globalData) await globalData.deleteOne();
}