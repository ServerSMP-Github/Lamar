const roleColorSchema = require('../../models/server/prefix');
const client = require("../../index");

module.exports = async(guild) => {
    const roleColorData = await roleColorSchema.findOne({ Guild: guild.id });

    if (roleColorData) await roleColorData.delete();
}