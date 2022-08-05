module.exports = (client) => {

    const { MessageEmbed } = require("discord.js");

    const config = require("../settings/settings.json");

    if (!config.music.enabled) return client.music = false;

    const chalk = require("chalk");

    const facebook = require('erela.js-facebook');
    const spotify = require('erela.js-spotify');
    const apple = require('erela.js-apple');
    const { Manager } = require('erela.js');

    client.music = new Manager({
        nodes: [
            {
                retryDelay: 5000,
                host: config.music.lavalink.host,
                port: config.music.lavalink.port,
                password: config.music.lavalink.password,
            },
        ],
        plugins: [
            new apple(),
            new facebook(),
            new spotify({
                clientID: config.music.spotify.id,
                clientSecret: config.music.spotify.secret
            }),
        ],
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        }
    })
    .on("nodeConnect", (node) => console.log(`${chalk.white(`Lavalink:`)} ${chalk.green("√")} ${chalk.white("||")} ${chalk.white(`Host:`)} ${chalk.red(node.options.identifier)}`))
    .on("nodeError", (node, error) => console.log(`${chalk.white(`Lavalink:`)} ${chalk.red("×")} ${chalk.white("||")} ${chalk.white(`Host:`)} ${chalk.red(node.options.identifier)}`))
    .on("trackStart", (player, track) => client.channels.cache.get(player.textChannel).send({
        embeds: [
            new MessageEmbed()
            .setDescription(`▶ **|** Started playing: **[${track.title}](${track.uri})**`)
            .setThumbnail(`${track.thumbnail ? track.thumbnail : 'https://serversmp-api.herokuapp.com//upload/1/prince/hXLEkmnukU.png'}`)
            .setColor("BLUE")
        ]
    }))
    .on("queueEnd", (player) => {
        client.channels.cache
            .get(player.textChannel)
            .send({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏹ **|** The music has ended, use **\`/play\`** to play some music`)
                    .setColor("BLUE")
                ]
            });

        player.destroy();
    });

}