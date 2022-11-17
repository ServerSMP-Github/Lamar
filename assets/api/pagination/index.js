const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

async function buttonPagination(message, embeds) {
    if (!message || !embeds) throw new Error(console.log("Please provide all arguments, make sure they are valid"))

    let index = 0;

    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous Page")
            .setEmoji("◀️")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("home")
            .setLabel("Home Page")
            .setEmoji("🏠")
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next Page")
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Secondary),
        );

    const buttons = [button];

    const msg = await message.channel.send({ embeds: [embeds[0]], components: buttons }).then((message) => {

        const filter = (interaction) => {
            return !interaction.user.bot
        };

        const collector = message.createMessageComponentCollector({
            filter,
            componentType: ComponentType.Button,
            time: 50000
        });

        collector.on("collect", async (interaction) => {
            if (interaction.user.id === message.author.id) return interaction.reply({
                content: "Only the button owner can use these",  
                ephemeral: true,
            });

            if (!["previous", "home", "next"].includes(interaction.customId)) return;

            if (interaction.customId == "previous") {
                index = index > 0 ? --index : embeds.length - 1;
                await interaction.deferUpdate();

                await interaction.message.edit({ embeds: [embeds[index]] });

            } else if (interaction.customId == "home") {
                index = 0;
                await interaction.deferUpdate();

                await interaction.message.edit({ embeds: [embeds[index]] });

            } else if (interaction.customId == "next") {
                index = index + 1 < embeds.length ? ++index : 0;
                await interaction.deferUpdate();

                await interaction.message.edit({ embeds: [embeds[index]] });
            } 
        });

        collector.on("end", () => {                   
            button.components[0].setDisabled(true);
            button.components[1].setDisabled(true);
            button.components[2].setDisabled(true);

            message.edit({ components: [button] });
        });
    });

    return msg;
}

module.exports = {
    buttonPagination
}