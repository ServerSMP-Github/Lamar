const express = require("express");
const router = express.Router();

const client = require("../../index");

const musicSchema = require("../../models/server/music.js");

const checkAPIAuth = (req, res, next) => {
    if (!client.config.api.server.enabled) return res.json({ error: "API disabled" });

    if (!client.config.api.server.keys.includes(req.headers.authorization)) return res.json({ error: "Missing API key" });

    next();
};

// router.get("/", async (req, res) => {
//     // TODO:
//     // Create an admin panel of sorts for this
//     // It would allow "owners" of the bot to create/delete API keys
// });

router.post("/music/play", checkAPIAuth, async (req, res) => {
    const { query, guild, channel: { text, voice }, user } = req.body;
    if (!query || !text || !voice || !user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    let player = client.poru.players.get(guild);

    if (!player) player = client.poru.createConnection({
        guildId: guild,
        voiceChannel: voice,
        textChannel: text,
        deaf: true
    });

    const { loadType, tracks, playlistInfo } = await client.poru.resolve({ query: query, source: "ytsearch" });

    const api = { type: loadType === "playlist" ? "playlist" : "search" };

    if (loadType === "playlist") {
        for (const track of tracks) {
            track.info.requester = member;
            player.queue.add(track);
        }

        api.track = {
            length: tracks.length,
            title: playlistInfo.name
        };
    } else if (loadType === "search" || loadType === "track") {
        const track = tracks.shift();
        track.info.requester = member;
        player.queue.add(track);

        api.track = {
            title: track.info.title,
            url: track.info.uri,
            image: track.info.artworkUrl
        };
    } else return res.json({ error: "Failed to find your song" });

    const musicData = await musicSchema.findOne({ Guild: guild });
    if (musicData && musicData.Shuffle === true) player.queue.shuffle();

    if (!player.isPlaying && !player.isPaused) {
        player.setVolume(50);
        player.play();
    }

    return res.json({ success: "Added song", response: api });

});

router.post("/music/stop", checkAPIAuth, async (req, res) => {
    const { guild, user } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    player.destroy();

    return res.json({ success: "Stop player" });

});

router.post("/music/skip", checkAPIAuth, async (req, res) => {
    const { guild, user } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    player.stop();

    return res.json({ success: "Skipped song" });

});

router.post("/music/pause", checkAPIAuth, async (req, res) => {
    const { guild, user } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    let isAlready = true;

    if (player.isPlaying) {
        isAlready = false

        player.pause(true);
    }

    return res.json({ success: isAlready ? "Player is already paused" : "Paused player" });

});

router.post("/music/resume", checkAPIAuth, async (req, res) => {
    const { guild, user } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    let isAlready = true;

    if (player.isPaused) {
        isAlready = false

        player.pause(false);
    }

    return res.json({ success: isAlready ? "Player is already resumed" : "Resumed player" });

});

router.post("/music/volume", checkAPIAuth, async (req, res) => {
    const { guild, user, volume } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    if (!volume) return res.json({ success: "Fetched volume", volume: player.volume });

    const number = Number(volume);
    if (number < 0 || number > 100) return res.json({ error: "Volume level cant surpass 100 or be lower then 0" });

    player.setVolume(number);

    return res.json({ success: "Changed volume of player" });

});

router.post("/music/loop", checkAPIAuth, async (req, res) => {
    const { guild, user, type } = req.body;
    if (!user || !guild || !type) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    if (!["queue", "single", "off"].includes(type)) return res.json({ error: "Type must be either queue, track or off" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    let message = "Changed loop mode";

    if (type === "off") player.loop === "NONE" ? message = "Loop mode is already none" : player.setLoop("NONE");
    else if (type === "single") player.loop === "TRACK" ? message = "Loop mode is already single" : player.setLoop("TRACK");
    else if (type === "queue") player.loop === "QUEUE" ? message = "Loop mode is already queue" : player.setLoop("QUEUE");

    return res.json({ success: message });

});

router.post("/music/playing", checkAPIAuth, async (req, res) => {
    const { guild, user } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player || !player.currentTrack) return res.json({ error: "Server does not music player" });

    return res.json({
        success: "Got current song",
        response: {
            track: {
                title: player.currentTrack.info.title,
                url: player.currentTrack.info.uri
            },
            user: {
                username: player.currentTrack.info.requester.user.username,
                avatar: player.currentTrack.info.requester.displayAvatarURL()
            }
        }
    });

});

router.post("/music/queue", checkAPIAuth, async (req, res) => {
    const { guild, user, page = 1 } = req.body;
    if (!user || !guild) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(user);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    const queue = player.queue;
    if (!queue.length) return res.json({ error: "Queue is empty" });

    const multiple = 10;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    const api = { queue: [] };

    if (player.currentTrack) api.current = { title: player.currentTrack.info.title, url: player.currentTrack.info.uri };

    if (!tracks.length) return res.json({ success: "Nothing found" });

    for (let index = 0; index < tracks.length; index++) {
        const track = tracks[index];

        api.queue.push({ title: track.info.title, url: track.info.uri });
    }

    const maxPages = Math.ceil(queue.length / multiple);

    api.page = { current: page, max: maxPages, start: start, end: end }; 

    return res.json({ success: "Successfully got queue", response: api });

});

router.post("/music/shuffle", checkAPIAuth, async (req, res) => {
    const { guild, user, type } = req.body;
    if (!user || !guild || !type) return res.json({ error: "Missing arguments" });

    if (client.config.music.whitelist && !client.config.music.whitelist.includes(guild)) return res.json({ error: "Music is disabled" });

    if (!["off", "on"].includes(type)) return res.json({ error: "Type must be either queue, track or off" });

    const fetchGuild = client.guilds.cache.get(guild);
    if (!fetchGuild) return res.json({ error: "Server does not exist" });

    let message = "Changed shuffle mode";

    let musicData = await musicSchema.findOne({ Guild: guild });
    if (!musicData) musicData = await musicSchema.create({ Guild: guild, Skip: false, Shuffle: false });

    if (type === "off") {
        if (musicData.Shuffle === false) message = "Shuffle mode is already off";
        else {
            musicData.Shuffle = false;
            await musicData.save();

            message = "Shuffle mode is now off";    
        }
    } else if (type === "on") {
        if (musicData.Shuffle === true) message = "Shuffle mode is already on";
        else {
            musicData.Shuffle = true;
            await musicData.save();

            message = "Shuffle mode is now on";
        }
    }

    return res.json({ success: message });

});

module.exports = {
    router: router,
    name: "api"
};