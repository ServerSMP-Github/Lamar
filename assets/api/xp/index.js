const Schema = require("../../../models/server/xpData");

async function createUser(userID, guildID) {
    if (!userID || !guildID) return console.error("Missing argument");

    const isUser = await Schema.findOne({ userID, guildID });
    if (isUser) return false;

    const newUser = await Schema.create({ userID, guildID });

    return newUser;
}

async function setLevel(userID, guildID, level) {
    if (!userID || !guildID || !level) return console.error("Missing argument");

    const user = await Schema.findOne({ userID, guildID });
    if (!user) return false;

    user.level = level;
    user.xp = level * level * 100;
    user.lastUpdated = new Date();

    await user.save();

    return user;
}

async function setXp(userID, guildID, xp) {
    if (!userID || !guildID || xp == 0 || !xp || isNaN(parseInt(xp))) return console.error("Missing argument");

    const user = await Schema.findOne({ userID, guildID });
    if (!user) return false;

    user.xp = xp;
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();

    await user.save();

    return user;
}

async function appendXp(userID, guildID, xp) {
    if (!userID || !guildID || xp == 0 || !xp || isNaN(parseInt(xp))) return console.error("Missing argument");

    const user = await Schema.findOne({ userID, guildID });

    if (!user) {
        await Schema.create({ userID, guildID, xp, level: Math.floor(0.1 * Math.sqrt(xp)) });

        return (Math.floor(0.1 * Math.sqrt(xp)) > 0);
    }

    user.xp += parseInt(xp, 10);
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();

    await user.save();

    return (Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level);
};

async function fetchUser(userID, guildID, fetchPosition = false) {
    const user = await Schema.findOne({ userID, guildID });
    if (!user) return false;

    if (fetchPosition === true) {
        const leaderboard = await Schema
            .find({ guildID })
            .sort([['xp', 'descending']])
            .exec();

        user.position = leaderboard.findIndex(i => i.userID === userID) + 1;
    }

    user.cleanXp = user.xp - xpFor(user.level);
    user.cleanNextLevelXp = xpFor(user.level + 1) - xpFor(user.level);

    return user;
}

function xpFor(level) {
    level = parseInt(level, 10);

    if (isNaN(level) || level < 0) return console.error("Missing argument");

    return level * level * 100;
}

async function fetchLeaderboard(guildID) {
    if (!guildID) return console.error("Missing argument");

    const users = await Schema
        .find({ guildID })
        .sort([['xp', 'descending']])
        .limit(10)
        .exec();

    return users;
}

async function computeLeaderboard(client, leaderboard, fetchUsers = false) {
    if (!client || !leaderboard) return console.error("Missing argument");
    if (leaderboard.length < 1) return [];

    const computedArray = [];
    for (const key of leaderboard) {
        const user = await (fetchUsers ? client.users.fetch(key.userID) : client.users.cache.get(key.userID)) || {
            username: "Unknown",
            discriminator: "0000"
        };

        computedArray.push({
            guildID: key.guildID,
            userID: key.userID,
            xp: key.xp,
            level: key.level,
            position: leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1,
            username: user.username,
            discriminator: user.discriminator
        });
    }

    return computedArray;
}

async function deleteGuild(guildID) {
    if (!guildID) return console.error("Missing argument");

    const guild = await Schema.findOne({ guildID });
    if (!guild) return false;

    await Schema.deleteMany({ guildID });

    return guild;
}


module.exports = {
    computeLeaderboard,
    fetchLeaderboard,
    deleteGuild,
    createUser,
    fetchUser,
    appendXp,
    setLevel,
    setXp,
    xpFor
}