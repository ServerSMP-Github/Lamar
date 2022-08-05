const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "play",
    description: "Play a song",
    options: [
        {
            name: "songtitle",
            description: "title of the song",
            type: "STRING",
            required: true,
        }
    ],
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

        let { channel } = interaction.member.voice; 

        if (!channel) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("Sorry, but you need to be in a voice channel to do that")
                .setColor("YELLOW")
            ]
        });

        const checkPlayer = client.music.get(interaction.guild.id);
        let botChannel = interaction.guild.me.voice.channel
        if (checkPlayer) {
            if (botChannel && channel.id !== botChannel.id) return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription("You are not in my voice channel")
                    .setColor("YELLOW")
                ]
            });
            else return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription("There is nothing playing")
                    .setColor("YELLOW")
                ]
            });
        }

        const songTitle = interaction.options.getString("songtitle");

        const res = await client.music.search(
            songTitle,
            interaction.user.member
        );

        if (res.loadType === "LOAD_FAILED") return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("Failed to find your song")
                .setColor("YELLOW")
            ]
        });

        const player = client.music.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
        });

        if (player.state !== 'CONNECTED') player.connect();

        player.queue.add(res.tracks[0]);

        interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription(`✅ **|** **[${res.tracks[0].title}](${res.tracks[0].uri})** has been added to the queue`)
                .setThumbnail(`${res.tracks[0].thumbnail ? res.tracks[0].thumbnail : 'https://serversmp-api.herokuapp.com//upload/1/prince/hXLEkmnukU.png'}`)
                .setColor("BLUE")
            ]
        });

        if (!player.playing && !player.paused && !player.queue.size) player.play();

        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();

    },
};