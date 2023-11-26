const welcomeSchema = require("../../models/logs/welcome");
const client = require("../../index");

module.exports = async(channel) => {
    const welcomeData = await welcomeSchema.findOne({ Channel: channel.id });

    if (welcomeData) await welcomeData.deleteOne();
}