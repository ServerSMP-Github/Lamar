const {
    Client,
    CommandInteraction,
    EmbedBuilder,
    MessageActionRow,
    MessageButton,
    MessageAttachment,
    ApplicationCommandType
} = require("discord.js");
const progressbar = require('string-progressbar');
const xpSchema = require("../../models/server/xp");
const canvacord = require("canvacord");
const Levels = require('discord-xp');

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
        xpSchema.findOne({
            Guild: interaction.guild.id
        }, async (mainErr, mainData) => {
            if (mainErr) return console.error(mainErr);
            if (!mainData) return interaction.followUp({
                content: "XP system is disabled on this server!",
                ephemeral: true
            });
            if (mainData) {
                let status;
                if (interaction.targetId === client.user.id) {
                    const user = await Levels.fetch(interaction.member.user.id, interaction.guild.id, true)
                    if (!user) return interaction.followUp({
                        content: "You dont have xp. try to send some messages.",
                        ephemeral: true
                    });
                    var total = Levels.xpFor(user.level + 1);
                    var current = user.xp;
                    let bar = progressbar.filledBar(total, current, 40, "□", "■")[0];
                    const embed = new EmbedBuilder()
                        .setTitle(`${interaction.member.user.username}'s Rank`)
                        .setDescription(`**Rank**: \`${user.position}\`\n**Level**: \`${user.level}\`\n**XP**: \`${bar} ${current}/${total}\``)
                        .setThumbnail(interaction.member.user.displayAvatarURL({
                            format: 'png',
                            size: 512
                        }))
                        .setColor("Random")
                    interaction.followUp({
                        embeds: [embed]
                    })
                } else {
                    const guild = client.guilds.cache.get(interaction.guild.id)
                    const user_find = guild.members.cache.get(interaction.targetId)
                    const user = await Levels.fetch(interaction.targetId, interaction.guild.id, true)
                    if (!user) return interaction.followUp({
                        content: "That user dont have xp.",
                        ephemeral: true
                    });
                    try {
                        status = user_find.presence.status
                    } catch (err) {
                        status = "offline"
                    }
                    const rank = new canvacord.Rank()
                        .setAvatar(user_find.user.displayAvatarURL({
                            format: 'png',
                            size: 512
                        }))
                        .setCurrentXP(user.xp)
                        .setRequiredXP(Levels.xpFor(user.level + 1))
                        .setRank(user.position)
                        .setLevel(user.level)
                        .setStatus(status)
                        .setProgressBar("#FFFFFF")
                        .setUsername(user_find.user.username)
                        .setDiscriminator(user_find.user.discriminator);
                    rank.build()
                        .then(data => {
                            const attachment = new MessageAttachment(data, "RankCard.png");
                            interaction.followUp({
                                files: [attachment]
                            });
                        })
                }
            }
        });
    },
};