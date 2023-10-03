const altDetectionSchema = require('../../models/moderator/altDetectionSystem');
const client = require("../../index");

module.exports = async(guild) => {
    const altDetectionData = await altDetectionSchema.findOne({ Guild: guild.id });

    if (altDetectionData) await altDetectionData.deleteOne();
}