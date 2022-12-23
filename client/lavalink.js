module.exports = (client) => {

    require("../lavalink");

    const { EmbedBuilder } = require("discord.js");

    const { Poru } = require("poru");
    // const { Spotify } = require("poru-spotify");

    const config = require("../settings/settings.json");

    if (!config.music.enabled) return client.poru = false;

    const colors = require("../assets/api/console");

    client.poru = new Poru(
        client,
        config.music.lavalink,
        {
            library: "discord.js",
            defaultPlatform: "ytsearch",
            plugins: [
                // new Spotify({
                //     clientID: config.music.spotify.id,
                //     clientSecret: config.music.spotify.secret
                // })
            ]
        }
    )
    .on("nodeConnect", (node) => console.log(`${colors.fgWhite(`Lavalink:`)} ${colors.fgGreen("√")} ${colors.fgWhite("||")} ${colors.fgWhite(`Host:`)} ${colors.fgRed(node.options.host)}`))
    .on("nodeDisconnect", (node) => console.log(`${colors.fgWhite(`Lavalink:`)} ${colors.fgRed("×")} ${colors.fgWhite("||")} ${colors.fgWhite(`Host:`)} ${colors.fgRed(node.options.host)}`))
    .on("trackStart", (player, track) => client.channels.cache.get(player.textChannel).send({
        embeds: [
            new EmbedBuilder()
            .setDescription(`▶ **|** Started playing: **[${track.info.title}](${track.info.uri})**`)
            .setThumbnail(`${track.info.image ? track.info.image : 'https://api.serversmp.xyz/upload/1/prince/hXLEkmnukU.png'}`)
            .setFooter({ text: `Requested by ${track.info.requester.user.username}`, iconURL: track.info.requester.displayAvatarURL() })
            .setColor("Blue")
        ]
    }))
    .on("trackError", (client, player, track, error) => client.channels.cache.get(player.textChannel).send({
        embeds: [
            new EmbedBuilder()
            .setDescription(`▶ **|** Failed playing: **[${track.info.title}](${track.info.uri})**`)
            .setThumbnail(`${track.info.image ? track.info.image : 'https://api.serversmp.xyz/upload/1/prince/hXLEkmnukU.png'}`)
            .setFooter({ text: error.exception.message, iconURL: "https://api.serversmp.xyz/upload/62fe2685c5e166db131dcfae" })
            .setColor("Blue")
        ]
    }))
    .on("queueEnd", (player, queue) => {
        client.channels.cache.get(player.textChannel).send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`⏹ **|** The music has ended, use **\`/play\`** to play some music`)
                .setColor("Blue")
            ]
        });
        return player.destroy();
    });

}