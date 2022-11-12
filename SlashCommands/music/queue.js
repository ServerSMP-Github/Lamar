const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "queue",
    description: "Display the song queue",
    options: [{
        name: "page",
        description: "the page of the queue to display",
        type: "INTEGER",
        required: false,
    }],
    run: async (client, interaction, args) => {

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

        // let { channel } = interaction.member.voice; 

        // if (!channel) return interaction.followUp({
        //     embeds: [
        //         new MessageEmbed()
        //         .setDescription("Sorry, but you need to be in a voice channel to do that")
        //         .setColor("YELLOW")
        //     ]
        // });

        // if (player.voiceChannel !== channel.id) return interaction.followUp({
        //     embeds: [
        //         new MessageEmbed()
        //         .setDescription("You are not in my voice channel")
        //         .setColor("YELLOW")
        //     ]
        // });

        if (!player.playing) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription("There is nothing playing")
                .setColor("YELLOW")
            ]
        });

        const queue = player.queue;
        const embed = new MessageEmbed()
            .setTitle("Song Queue")
            .setColor("BLUE")

        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        if (queue.current) embed.addField("Now Playing", `🎶 | [**${queue.current.title}**](${queue.current.uri})`);

        if (!tracks.length) embed.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [**${track.title}**](${track.uri})`).join("\n"));

        const maxPages = Math.ceil(queue.length / multiple);

        embed.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });

        return interaction.followUp({
            embeds: [embed]
        });

    },
};
