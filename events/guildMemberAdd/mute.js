const Schema = require('../../models/moderator/mute');
const client = require("../../index");

module.exports = async(member) => {
    const muteData = await Schema.findOne({ Guild: member.guild.id });

    if (!muteData) return;
    
    const user = data.Users.findIndex((prop) => prop === member.id);
    if (user === -1) return;

    const role = member.guild.roles.cache.find((role) => role.name.toLowerCase() === "muted");
    member.roles.add(role.id);
}