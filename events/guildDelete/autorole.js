const autoRoleSchema = require('../../models/server/autorole');
const client = require("../../index");

module.exports = async(guild) => {
    const autoRoleData = await autoRoleSchema.findOne({ Guild: guild.id });

    if (autoRoleData) await autoRoleData.deleteOne();
}