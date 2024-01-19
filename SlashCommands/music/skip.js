const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto/index.js");
const musicSchema = require("../../models/server/music.js");

module.exports = {
    name: "skip",
    description: "Skip the currently playing song.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        const musicConfig = client.config.music;
        if (!musicConfig.enabled || (musicConfig.whitelist && !musicConfig.whitelist.includes(interaction.guild.id))) {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: `${client.user.username} will not be doing music anymore, please use \`youtube together\``
                    })
                    .setColor("Blue")
                ]
            });
        }

        const player = client.poru.players.get(interaction.guild.id);
        if (!player) {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("There is nothing playing")
                    .setColor("Yellow")
                ]
            });
        }

        const { channel } = interaction.member.voice;

        if (!channel) {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("Sorry, but you need to be in a voice channel to do that")
                    .setColor("Yellow")
                ]
            });
        }

        if (player.voiceChannel !== channel.id) {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("You are not in my voice channel")
                    .setColor("Yellow")
                ]
            });
        }

        const commandType = await musicSchema.findOne({ Guild: interaction.guild.id });

        if (commandType?.Skip) {
            const members = channel.members.filter(member => !member.user.bot);
            const userIds = members.map(member => member.user.id);

            const message = await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🟦 **|** Voting to skip **current** song")
                    .setFooter({
                        text: "(voting only last for 30 seconds)"
                    })
                    .setColor("Blue")
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`acceptSkip-${interaction.guild.id}`)
                        .setLabel('Accept')
                        .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                        .setCustomId(`denySkip-${interaction.guild.id}`)
                        .setLabel('Deny')
                        .setStyle(ButtonStyle.Danger),
                    )
                ],
            });

            let results = 0;
            const users = new Set(userIds);

            const voteCollector = message.createMessageComponentCollector({
                filter: i => users.has(i.user.id),
                time: 30000
            });

            voteCollector.on('collect', async (button) => {
                users.delete(button.user.id);

                if (button.customId === `acceptSkip-${interaction.guild.id}`) results++;
                else if (button.customId === `denySkip-${interaction.guild.id}`) results--;

                button.reply({
                    content: "Vote submitted",
                    ephemeral: true
                });
            });

            voteCollector.on('end', async () => {
                if (!results) {
                    const chance = getRandomInt(1, 2);

                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription("⬜ **|** We're flipping a coin to break the tie.")
                            .setColor("White")
                        ]
                    });

                    if (chance === 1) return skipAccept(true);
                    else return skipDeny();
                }

                if (results > 0 || userIds.length < Math.abs(results) / 2) return skipAccept(true);
                else return skipDeny();
            });
        } else return skipAccept();

        function skipAccept(vote) {
            player.stop();

            const embedData = vote ? { description: "🟩 **|** Most people voted to skip", color: "Green" } : { description: "⏭ **|** Skipped **current** song", color: "Blue" };

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(embedData.description)
                    .setColor(embedData.color)
                ]
            });
        }

        function skipDeny() {
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🟥 **|** The majority voted not to skip")
                    .setColor("Red")
                ]
            });
        }

    },
};