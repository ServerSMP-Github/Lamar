const { Client, CommandInteraction, EmbedBuilder, AttachmentBuilder, ApplicationCommandType } = require("discord.js");
const progressbar = require('../../assets/api/progressbar');
const { fetchUser, xpFor } = require("../../assets/api/xp");
const xpSchema = require("../../models/server/xp");
const canvacord = require("canvacord");

module.exports = {
    name: "user rank",
    type: ApplicationCommandType.User,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const { user } = interaction.guild.members.cache.get(interaction.targetId);

        const xpData = await xpSchema.findOne({ Guild: interaction.guild.id });
        if (!xpData) return interaction.followUp({
            content: "XP system is disabled on this server!",
            ephemeral: true
        });

        const xpUser = await fetchUser(user.id, interaction.guild.id, true);
        if (!xpUser) return interaction.followUp({
            content: "You dont have xp. try to send some messages.",
            ephemeral: true
        });

        const total = xpFor(xpUser.level + 1);
        const current = xpUser.xp;

        if (user.id === client.user.id) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.member.user.username}'s Rank`)
                .setDescription(`**Rank**: \`${xpUser.position}\`\n**Level**: \`${xpUser.level}\`\n**XP**: \`${progressbar(client, current, total, 40, "□", "■")} ${current}/${total}\``)
                .setThumbnail(user.displayAvatarURL({
                    format: 'png',
                    size: 512
                }))
                .setColor("Random")
            ]
        });

        const user_find = (client.guilds.cache.get(interaction.guild.id)).members.cache.get(user.id);

        let status = "offline";
        try {
            status = user_find.presence.status;
        } catch(err) {
            status = "offline";
        }

        const rank = new canvacord.Rank()
            .setAvatar(user.displayAvatarURL({
                format: 'png',
                size: 512
            }))
            .setCurrentXP(current)
            .setRequiredXP(total)
            .setRank(xpUser.position)
            .setLevel(xpUser.level)
            .setStatus(status)
            .setProgressBar("#FFFFFF")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator);

        const file = await rank.build();

        return interaction.followUp({
            files: [new AttachmentBuilder(file, { name: "RankCard.png" })]
        });
    },
};