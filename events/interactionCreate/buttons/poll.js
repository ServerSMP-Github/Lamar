const pollSchema = require('../../../models/server/poll-cmd');
const { ButtonBuilder } = require("discord.js");

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.slice(0, 4) !== "poll") return;

    const pollData = await pollSchema.findOne({ message: interaction.message.id });
    if (!pollData) return;

    interaction.deferUpdate();

    const findUserIndex = (obj, customId, userId) => obj?.findIndex(obj => obj.number === customId.slice(4) && obj.user === userId);

    const updateButtonLabel = (irows, customId, delta) => {
        for (let i = 0; i < irows.length; i++) {
            const index = irows[i].components.findIndex(obj => obj.customId === customId);

            if (index === -1) continue;
            else {
                const num = Number(irows[i].components[index].label);

                const button = new ButtonBuilder()
                .setCustomId(irows[i].components[index].customId)
                .setLabel(String(num + delta))
                .setEmoji(irows[i].components[index].emoji)
                .setDisabled(false)
                .setStyle(irows[i].components[index].style)

                irows[i].components[index] = button;

                interaction.message.edit({ components: irows });
            }
        }
    };

    const index = findUserIndex(pollData.users, interaction.customId, interaction.user.id);

    if (index === -1) {
        await pollSchema.findOneAndUpdate({ message: interaction.message.id }, {
            $push: {
                    users: { number: interaction.customId.slice(4), user: interaction.user.id },
                },
            }
        );

        updateButtonLabel(interaction.message.components, interaction.customId, 1);
    } else {
        await pollSchema.findOneAndUpdate({ message: interaction.message.id }, {
            $pull: {
                    users: { number: interaction.customId.slice(4), user: interaction.user.id },
                },
            }
        );

        updateButtonLabel(interaction.message.components, interaction.customId, -1);
    }

}