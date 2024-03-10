const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const musicSchema = require("../../models/server/music.js");

module.exports = {
    name: "play",
    description: "Play a song.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "songtitle",
            description: "Title of the song.",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, interaction) => {

        if (client.config.music.enabled === false || (client.config.music.whitelist && client.config.music.whitelist.includes(interaction.guild.id) === false)) return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `${client.user.username} will not be doing music anymore, please use \`youtube together\`` })
                .setColor("Blue")
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

        const checkPlayer = client.poru.players.get(interaction.guild.id);
        let botChannel = interaction.guild.members.me.voice.channel
        if (checkPlayer) {
            if (botChannel && channel.id !== botChannel.id) return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription("You are not in my voice channel")
                    .setColor("Yellow")
                ]
            });
        }

        const player = client.poru.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channel.id,
            deaf: true
        });

        const songTitle = interaction.options.getString("songtitle");

        const resolve = await client.poru.resolve({ query: songTitle, source: "ytsearch" });
        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === "playlist") {

            for (const track of resolve.tracks) {
                track.info.requester = interaction.member;
                player.queue.add(track);
            }

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`✅ **|** Added **${tracks.length}** songs from **${playlistInfo.name}**`)
                    .setThumbnail("https://api.serversmp.xyz/upload/1/prince/hXLEkmnukU.png")
                    .setColor("Blue")
                ]
            });

        } else if (loadType === "search" || loadType === "track") {

            const track = tracks.shift();
            track.info.requester = interaction.member;

            player.queue.add(track);

            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`✅ **|** **[${track.info.title}](${track.info.uri})** has been added to the queue`)
                    .setThumbnail(`${track.info.artworkUrl || 'https://api.serversmp.xyz/upload/1/prince/hXLEkmnukU.png'}`)
                    .setColor("Blue")
                ]
            });

        } else return interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setDescription("Failed to find your song")
                .setColor("Yellow")
            ]
        });


        const musicData = await musicSchema.findOne({ Guild: interaction.guild.id });
        if (musicData && musicData.Shuffle === true) player.queue.shuffle();

        if (!player.isPlaying && !player.isPaused) {
            player.setVolume(50);

            return player.play();
        }

    },
};