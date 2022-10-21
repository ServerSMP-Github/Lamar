const fetch = require("axios");

module.exports = async(guild, limit = 1000, page = 0) => {
    const { players } = (await fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/${guild}?limit=${limit}&page=${page}`)).data;

    return players.map((user, index) => {
        const { id, level } = user;
        const [levelXp] = user.detailed_xp;
        return {
            id,
            level,
            xp: levelXp,
            rank: (limit * page) + index + 1
        };
    });
}