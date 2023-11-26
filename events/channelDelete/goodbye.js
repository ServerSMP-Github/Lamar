const goodbyeSchema = require("../../models/logs/goodbye");
const client = require("../../index");

module.exports = async(channel) => {
    const goodbyeData = await goodbyeSchema.findOne({ Channel: channel.id });

    if (goodbyeData) await goodbyeData.deleteOne();
}