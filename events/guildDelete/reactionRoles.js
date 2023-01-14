const reactionRolesSchema = require('../../models/logs/reaction-roles');
const client = require("../../index");

module.exports = async(guild) => {
    const reactionRolesData = await reactionRolesSchema.findOne({ Guild: guild.id });

    if (reactionRolesData) await reactionRolesData.delete();
}