const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const musicSchema = require("../../models/server/music.js");
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: "skip",
    description: "Skips a song",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        if (client.config.music.enabled === false || (client.config.music.whitelist && client.config.music.whitelist.includes(interaction.guild.id) === false)) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `${client.user.username} will not be doing music anymore, please use \`youtube together\`` })
                .setColor("Blue")
            ]
        });

        const player = client.poru.players.get(interaction.guild.id);
        if (!player) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("There is nothing playing")
                .setColor("Yellow")
            ]
        });

        let { channel } = interaction.member.voice;

        if (!channel) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("Sorry, but you need to be in a voice channel to do that")
                .setColor("Yellow")
            ]
        });

        if (player.voiceChannel !== channel.id) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("You are not in my voice channel")
                .setColor("Yellow")
            ]
        });

        function skipAccept(vote) {
            player.stop();

            if (vote) interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🟩 **|** Most people voted to skip")
                    .setColor("Green")
                ]
            });

            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("⏭ **|** Skipped **current** song")
                    .setColor("Blue")
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

        const commandType = (await musicSchema.findOne({ Guild: interaction.guild.id }))?.Skip === true ? true : false;

        if (commandType) {
            const members = channel.members;

            const userIds = await members.filter(member => !member.user.bot).map(member => member.user.id);

            const message = await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("🟦 **|** Voting to skip **current** song")
                    .setFooter({ text: "(voting only last for 30 seconds)" })
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

            let results = null;
            let users = userIds;

            const filter = (i) => userIds.includes(interaction.user.id);

            const voteCollector = await message.createMessageComponentCollector({ filter: filter, time: 30000 });

            voteCollector.on('collect', async (button) => {
                if (!users.includes(button.user.id)) return button.reply({ content: "You have already voted", ephemeral: true });

                if (results === null) results = -1 * userIds;

                const index = users.indexOf(button.user.id);
                if (index > -1) users.splice(index, 1);

                if (button.customId === `acceptSkip-${interaction.guild.id}`) results++;
                else if (button.customId === `denySkip-${interaction.guild.id}`) results--;

                return button.reply({ content: "Vote submitted", ephemeral: true });
            });

            voteCollector.on('end', async (msgs, reason) => {
                if (!results === null) return interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription("🟨 **|** Canceling did not receive any votes")
                        .setColor("Yellow")
                    ]
                });

                if (userIds.length === 0 || userIds.length < results / 2 || results > 0) return skipAccept(true);
                else if (results === 0) {
                    const chance = getRandomInt(1 , 2);

                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription("⬜ **|** We're flipping a coin to break the tie.")
                            .setColor("White")
                        ]
                    });

                    if (chance === 1) return skipAccept(true)
                    else return skipDeny();
                } else return skipDeny();
            });
        } else return skipAccept();

    },
};