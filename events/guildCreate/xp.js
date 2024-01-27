const { createUser, setLevel } = require("../../assets/api/xp");
const getLeaderboard = require("../../assets/api/mee6");
const xpSchema = require('../../models/server/xp');
const client = require("../../index");

module.exports = async(guild) => {
    const xpData = await xpSchema.findOne({ Guild: guild.id });
    if (xpData) return;

    await xpSchema.create({
        Guild: guild.id,
        Channel: "false",
        Ping: false,
        WebUI: true,
        Rate: 6,
    });

    const mee6Data = await getLeaderboard(guild.id);
    if (mee6Data?.error || !mee6Data) return;

    for (let index = 0; index < mee6Data.length; index++) {
        const element = mee6Data[index];

        await createUser(element.id, message.guild.id);
        if (element.level >= 1) await setLevel(element.id, message.guild.id, element.level);
        // if (element.xp >= 1) await Levels.appendXp(element.id, message.guild.id, element.xp);
    }
}