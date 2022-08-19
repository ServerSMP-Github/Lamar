const { Message, Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle } = require("discord.js");
const env = {
    permissions: [
        PermissionsBitField.Flags.KickMembers,
        PermissionsBitField.Flags.BanMembers,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.SendMessagesInThreads,
        PermissionsBitField.Flags.CreatePublicThreads,
        PermissionsBitField.Flags.CreatePrivateThreads,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.MentionEveryone,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.ManageGuild,
        PermissionsBitField.Flags.UseExternalEmojis,
        PermissionsBitField.Flags.UseExternalStickers,
        PermissionsBitField.Flags.ManageWebhooks,
        PermissionsBitField.Flags.ManageRoles,
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.ManageNicknames,
        PermissionsBitField.Flags.ManageEmojisAndStickers,
        PermissionsBitField.Flags.ManageThreads,
        PermissionsBitField.Flags.ChangeNickname,
        PermissionsBitField.Flags.MoveMembers,
        PermissionsBitField.Flags.DeafenMembers,
        PermissionsBitField.Flags.MuteMembers,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.PrioritySpeaker,
        PermissionsBitField.Flags.UseVAD
    ],
    scopes: [
        "applications.commands",
        "bot"
    ]
}

module.exports = {
    name: "info",
    description: "Give's some info on the bot.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Info")
            .setThumbnail("https://github.com/Prince527GitHub/ServerSMP/blob/ServerSMP-Web/assets/image/banner/banner-bot.png?raw=true")
            .addField("Ping:", `\`${client.ws.ping}ms\``)
            .addField("Servers:", `\`${client.guilds.cache.size}\``)
            .setImage("https://github.com/Prince527GitHub/ServerSMP/blob/ServerSMP-Web/assets/qrcode.png?raw=true")
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL(client.generateInvite({ scopes: env.scopes, permissions: env.permissions }))
                .setLabel('Invite!')
        ).addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://serversmp.xyz/')
                .setLabel('Website!')
        ).addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/7vfx4QaAcU')
                .setLabel('Discord!')
        )
        message.channel.send({ embeds: [embed], components: [row] })
    },
};
