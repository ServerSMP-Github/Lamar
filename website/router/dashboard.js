const { getFileList } = require("../../assets/api/file");
const { PermissionsBitField } = require("discord.js");
const client = require("../../index");
const passport = require("passport");
const url = require("url");

module.exports = (app) => {
    const renderTemplate = (res, req, template, data = {}) => {
        const baseData = {
            bot: client,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
        }

        res.render(
            template,
            Object.assign(baseData, data),
        );
    };

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    };

    app.get("/login", (req, res, next) => {
        if (req.session.backURL) req.session.backURL = req.session.backURL;
        else if (req.headers.referer) {
            const parsed = url.parse(req.headers.referer);
            if (parsed.hostname === app.locals.domain) req.session.backURL = parsed.path;
        } else req.session.backURL = "/";

        next();
    }, passport.authenticate("discord"));

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res,) => {
        if (req.session.backURL) {
            const backURL = req.session.backURL;
            req.session.backURL = null;
            res.redirect(backURL);
        } else res.redirect("/");
    });

    app.get("/logout", function(req, res) {
        req.session.destroy(() => 
            req.logout(() =>
                res.redirect("/")
            )
        );
    });

    app.get("/", (req, res) => {
        renderTemplate(res, req, "dashboard/index.ejs", {
            discordInvite: client.config.dashboard.invite,
        });
    });

    app.get("/dashboard", checkAuth, (req, res) => {
        renderTemplate(res, req, "dashboard/dashboard.ejs", {
            perms: PermissionsBitField
        });
    });

    app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");

        let member = await guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                member = await guild.members.fetch(req.user.id);
            } catch (err) {
                console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
            }
        }

        if (!member) return res.redirect("/dashboard");
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return res.redirect("/dashboard");

        const setting = {};

        const optionsFiles = await getFileList(`${process.cwd()}/website/options/get`, { type: ".js", recursively: false });
        optionsFiles.map((value) => {
            const file = require(value);

            const run = file.run(req, res, client, guild, member);

            setting[file.name] = run;
        });

        renderTemplate(res, req, "dashboard/settings.ejs", {
            guild,
            settings: {
                prefix: await setting.prefix,
                captcha: await setting.captcha,
                xp: await setting.rank
            },
            alert: null,
        });
    });

    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID);
        if (!guild) return res.redirect("/dashboard");

        const member = guild.members.cache.get(req.user.id);
        if (!member) return res.redirect("/dashboard");

        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return res.redirect("/dashboard");

        const setting = {};

        const optionsFiles = await getFileList(`${process.cwd()}/website/options/set`, { type: ".js", recursively: false });
        optionsFiles.map((value) => {
            const file = require(value);

            const run = file.run(req, res, client, guild, member);

            setting[file.name] = run;
        });

        renderTemplate(res, req, "dashboard/settings.ejs", {
            guild,
            settings: {
                prefix: await setting.prefix,
                captcha: await setting.captcha,
                xp: await setting.rank
            },
            alert: "Your settings have been saved.",
        });
    });
}