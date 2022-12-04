const client = require("../../index");
const Levels = require("discord-xp");

module.exports = async(member) => {
    if (guildMemberRemove.bot) return;

    Levels.deleteUser(member.id, member.guild.id);
}