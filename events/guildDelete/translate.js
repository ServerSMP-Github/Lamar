const translateSchema = require('../../models/server/translate');
const client = require("../../index");

module.exports = async(guild) => {
    const translateData = await translateSchema.findOne({ Guild: guild.id });

    if (translateData) await translateData.deleteOne();
}