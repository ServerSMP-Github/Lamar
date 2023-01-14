const ccMsgSchema = require('../../models/server/cc');
const client = require("../../index");

module.exports = async(guild) => {
    const ccMsgData = await ccMsgSchema.findOne({ Guild: guild.id });

    if (ccMsgData) await ccMsgData.delete();
}