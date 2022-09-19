const { ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ban',
    usage: "[ user ]",
    description: "This command ban a member!",
    userPermission: [PermissionsBitField.Flags.BanMembers],
    run(client, message, args) {

        const target = message.mentions.users.first();
        if(!target) return message.reply({ content: "Who are trying to ban? The chat?" });
        if(target){
            const memberTarget = message.guild.members.cache.get(target.id);
            message.delete();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("2")
                    .setLabel("Approve ban")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                    new ButtonBuilder()
                    .setCustomId("1")
                    .setEmoji("🚫")
                    .setLabel("Disallow ban")
                    .setStyle(ButtonStyle.Danger),
                )

            const filter1 = i => i.customId === "2" && i.user.id;

            const collector_one = message.channel.createMessageComponentCollector({ filter1 });

            collector_one.on('collect', async i => {
                if (i.customId === "2") {
                    i.update({ content: "**Member baned**", components: [] });
                    memberTarget.ban();
                }
            });

            const filter2 = b => b.customId === "1" && i.user.id;

            const collector_two = message.channel.createMessageComponentCollector({ filter2 });
            
            collector_two.on('collect', async b => {
                if (b.customId === "1") b.update({ content: "**Member not baned**", components: [] });
            });

            message.channel.send({ content: "**ban command**", components: [row] });
        }

    }
}