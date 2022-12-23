const rankCardRequest = require('../../../models/management/rankcard-request');
const userRank = require("../../../models/user/user-rankcard");
const client = require("../../../index");

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId !== "rank-card-yes") return;

    if (interaction.channel.id !== client.config.channel.ids.rankcard) return;

    const rankData = await rankCardRequest.findOne({ Mesaage: interaction.message.id });
    const userData = await userRank.findOne({ User: rankData.User });

    if (rankData && userData) {
        userData.Background = rankData.Background;
        await userData.save();

        client.users.cache.get(rankData.User).send("Your RankCard image was accepted!");
        await rankData.delete();
    }

    const msg = await interaction.channel.fetchMessage(interaction.message.id);
    await msg.delete();
}