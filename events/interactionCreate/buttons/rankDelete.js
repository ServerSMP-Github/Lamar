const rankCardRequest = require('../../../models/management/rankcard-request');
const client = require("../../../index");

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId !== "rank-card-delete") return;

    if (interaction.channel.id !== client.config.channel.ids.rankcard) return;

    const rankData = await rankCardRequest.findOne({ Mesaage: interaction.message.id });
    if (rankData) await rankData.delete();

    const msg = await interaction.channel.fetchMessage(interaction.message.id);
    await msg.delete();
}