module.exports = (client) => {

    const { EmbedBuilder } = require("discord.js");
    
    const { Poru } = require('poru');

    const config = require("../settings/settings.json");

    if (!config.music.enabled) return client.music = false;

    const chalk = require("chalk");

    client.poru = new Poru(
        client,
        config.music.lavalink,
        {
            reconnectTime: 5000,
            deezer: {
                playlistLimit: 10,
            },
            spotify: {
                clientID: config.music.spotify.id,
                clientSecret: config.music.spotify.secret,
                playlistLimit: 5,
            },
            apple: {
                playlistLimit: 5,
            },
        }
    )
    .on("nodeConnect", (node) => console.log(`${chalk.white(`Lavalink:`)} ${chalk.green("√")} ${chalk.white("||")} ${chalk.white(`Host:`)} ${chalk.red(node.host)}`))
    .on("nodeClose", (node) => {
        setTimeout(()=> node.connect(), 10000);
        console.log(`${chalk.white(`Lavalink:`)} ${chalk.red("×")} ${chalk.white("||")} ${chalk.white(`Host:`)} ${chalk.red(node.host)}`);
    })
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