const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "skip",
    description: "Skips a song",
    run: async (client, interaction) => {

        if (client.music === false) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: `${client.user.username} will not be doing music anymore, please \`youtube\``
                })
                .setColor("BLUE")
            ]
        });

        const player = client.music.get(interaction.guild.id);
        if (!player) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        let { channel } = interaction.member.voice; 

        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("Sorry, but you need to be in a voice channel to do that")
                .setColor("YELLOW")
            ]
        });

        if (player.voiceChannel !== channel.id) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("You are not in my voice channel")
                .setColor("YELLOW")
            ]
        });        

        if (player.playing) return skip();
        else if (player.paused) return skip();
        else return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        function skip() {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription("⏭ **|** Skipped **current** song")
                    .setColor("BLUE")
                ]
            });
            player.stop();
        }

    },
};
