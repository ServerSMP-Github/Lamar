const nqnSchema = require('../../models/server/nqn');
const client = require("../../index");

module.exports = async(guild) => {
    const nqnData = await nqnSchema.findOne({ Guild: guild.id });

    if (nqnData) await nqnData.delete();
}