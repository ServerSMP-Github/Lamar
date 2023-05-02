const express = require("express");
const router = express.Router();

const { fetchLeaderboard, computeLeaderboard } = require("../../assets/api/xp");
const logSchema = require("../../models/logs/logsData");
const { PermissionsBitField } = require("discord.js");
const xpSchema = require("../../models/server/xp");
const { msToS } = require("../../assets/api/time");
const client = require("../../index");

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/login");
};

router.get("/lb/:guild", async (req, res) => {
    const guild = req.params.guild;
    if (!guild) return res.render("404.ejs");

    const xpData = await xpSchema.findOne({ Guild: guild });
    if (!xpData) return res.render("404.ejs");

    if (xpData.WebUI === false) return res.render("404.ejs");

    let lb = await fetchLeaderboard(guild);
    if (lb.length < 1) return res.render("404.ejs");

    lb = await computeLeaderboard(client, lb, true);

    for (let index = 0; index < lb.length; index++) {
        const user = lb[index];

        user.avatar = client.users.cache.get(user.userID).avatarURL();
    }

    const fetchGuild = client.guilds.cache.get(guild);

    res.render("api/lb.ejs", {
        guild: {
            id: guild,
            name: fetchGuild.name,
            icon: fetchGuild.iconURL()
        },
        lb: lb
    });

});

router.get("/logs/:guild", checkAuth, async (req, res) => {
    const guild = req.params.guild;
    if (!guild) return res.render("404.ejs");

    const logData = await logSchema.findOne({ Guild: guild });
    if (!logData) return res.render("404.ejs");

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(req.user.id);
    if (!member) return res.render("404.ejs");

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) return res.render("404.ejs");

    const months = {
        "01": "january",
        "02": "february",
        "03": "march",
        "04": "april",
        "05": "may",
        "06": "june",
        "07": "july",
        "08": "august",
        "09": "september",
        "10": "october",
        "11": "november",
        "12": "december"
    };

    const data = {
        cc: logData.ChannelCreate,
        cd: logData.ChannelDelete,
        cpu: logData.ChannelPinUpdate,
        cu: logData.ChannelUpdate,
        ec: logData.EmojiCreate,
        ed: logData.EmojiDelete,
        eu: logData.EmojiUpdate,
        ba: logData.BanAdd,
        br: logData.BanRemove,
        ma: logData.MemberAdd,
        mr: logData.MemberRemove,
        mu: logData.MemberUpdate,
    };

    const result = {};

    for (const key in data) {
        result[key] = [];
        for (const month in months) {
            result[key].push(0);
        }
        data[key].forEach(value => {
            const match = value.match(/-(\d{1,2})$/);
            if (match) {
                const monthValue = match[1].padStart(2, "0");
                const index = parseInt(monthValue) - 1;
                result[key][index] += 1;
            }
        });
    }

    res.render("api/logs.ejs", {
        guild: {
            id: guild,
            name: fetchGuild.name,
            icon: fetchGuild.iconURL()
        },
        messages: {
            total: logData.Messages,
            edited: logData.MessagesEdit,
            deleted: logData.MessagesDelete
        },
        logs: result
    });

});

router.get("/music/:guild", checkAuth, async (req, res) => {
    const guild = req.params.guild;
    if (!guild) return res.render("404.ejs");

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(req.user.id);
    if (!member) return res.render("404.ejs");

    const player = client.poru.players.get(guild);
    if (!player) return res.render("404.ejs");

    const queue = player.queue;

    for (let index = 0; index < queue.length; index++) {
        const track = queue[index];
        track.info.length = msToS(track.info.length);
        track.user = {
            avatar: track.info.requester.displayAvatarURL(),
            discriminator: track.info.requester.user.discriminator,
            username: track.info.requester.user.username,
            id: track.info.requester.user.id
        }
    }

    res.render("api/music.ejs", {
        guild: {
            id: guild,
            name: fetchGuild.name,
            icon: fetchGuild.iconURL()
        },
        music: {
            queue: queue,
            current: player.currentTrack ? player.currentTrack.info : null
        },
        member: member
    });

});

router.post("/music/:guild", checkAuth, async (req, res) => {
    const query = req.body.song;
    if (!query) return res.json({ error: "No guild specified" });

    const guild = req.params.guild;
    if (!guild) return res.json({ error: "No guild specified" });

    const fetchGuild = client.guilds.cache.get(guild);

    const member = fetchGuild.members.cache.get(req.user.id);
    if (!member) return res.json({ error: "Member or Guild does not exist" });

    const player = client.poru.players.get(guild);
    if (!player) return res.json({ error: "Server does not music player" });

    const { loadType, tracks } = await client.poru.resolve({ query: query, source: "ytsearch" });

    if (loadType === "PLAYLIST_LOADED") {

        for (const track of resolve.tracks) {
            track.info.requester = member;
            player.queue.add(track);
        }

    } else if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED") {

        const track = tracks.shift();
        track.info.requester = member;

        player.queue.add(track);

    } else return res.json({ error: "Failed to find your song" });

    if (!player.isPlaying && !player.isPaused) {
        player.setVolume(50);
        player.play();
    }

    return res.json({ success: "Added song" });

});

module.exports = {
    router: router,
    name: "api"
};