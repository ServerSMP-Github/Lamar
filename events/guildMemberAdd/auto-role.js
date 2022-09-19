const roleSchema = require('../../models/server/autorole');
const client = require("../../index");

module.exports = async(member) => {
    if (member.user.bot) return;

    const roleData = await roleSchema.findOne({ Guild: member.guild.id });

    if (!roleData) return;

    member.roles.add(member.guild.roles.cache.get(roleData.Role));
}