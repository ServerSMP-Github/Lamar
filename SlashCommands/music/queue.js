const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "queue",
    description: "Display the current song queue.",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "page",
        description: "the page of the queue to display",
        type: ApplicationCommandOptionType.Integer,
        required: false,
    }],
    run: async (client, interaction, args) => {

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

        // let { channel } = interaction.member.voice; 

        // if (!channel) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("Sorry, but you need to be in a voice channel to do that")
        //         .setColor("Yellow")
        //     ]
        // });

        // if (player.voiceChannel !== channel.id) return interaction.followUp({
        //     embeds: [
        //         new EmbedBuilder()
        //         .setDescription("You are not in my voice channel")
        //         .setColor("Yellow")
        //     ]
        // });

        const queue = player.queue;
        const embed = new EmbedBuilder()
            .setTitle("Song Queue")
            .setColor("Blue")

        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        if (player.currentTrack) embed.addFields([ { name: "Now Playing", value: `🎶 | [**${player.currentTrack.info.title}**](${player.currentTrack.info.uri})`} ]);

        if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [**${track.info.title}**](${track.info.uri})`).join("\n"));

        const maxPages = Math.ceil(queue.length / multiple);

        embed.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });

        return interaction.followUp({
            embeds: [embed]
        });

    },
};