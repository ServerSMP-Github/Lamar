const { deleteGuild } = require("../../assets/api/xp");
const client = require("../../index");

module.exports = async(guild) => {
    deleteGuild(guild.id);
}