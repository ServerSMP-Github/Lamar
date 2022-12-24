const { deleteUser } = require("../../assets/api/xp");
const client = require("../../index");

module.exports = async(member) => {
    if (member.bot) return;

    deleteUser(member.id, member.guild.id);
}