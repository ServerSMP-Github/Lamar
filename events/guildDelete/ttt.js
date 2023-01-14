const tttSchema = require('../../models/user/rps');
const client = require("../../index");

module.exports = async(guild) => {
    const tttData = await tttSchema.find({ Guild: guild.id });

    if (tttData.length > 0) await tttSchema.deleteMany({ Guild: guild.id });
}