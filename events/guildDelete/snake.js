const snakeSchema = require('../../models/user/rps');
const client = require("../../index");

module.exports = async(guild) => {
    const snakeData = await snakeSchema.find({ Guild: guild.id });

    if (snakeData.length > 0) await snakeSchema.deleteMany({ Guild: guild.id });
}