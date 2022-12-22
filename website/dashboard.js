const { PermissionsBitField } = require("discord.js");
const Strategy = require("passport-discord").Strategy;
const { getFileList } = require("../assets/api/file");
const colors = require('../assets/api/console');
const MongoStore = require('connect-mongo');
const session = require("express-session");
const passport = require("passport");
const express = require("express");
const url = require("url");

const app = express();

module.exports = async (client) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  let domain;
  let callbackUrl;

  try {
    const domainUrl = new URL(client.config.dashboard.domain);
    domain = {
      host: domainUrl.hostname,
      protocol: domainUrl.protocol,
    };
  } catch (e) {
    console.log(e);
    throw new TypeError("Invalid domain specific in the config file.");
  }

  if (client.config.dashboard.customDomain) callbackUrl = `${domain.protocol}//${domain.host}/callback`;
  else callbackUrl = `${domain.protocol}//${domain.host}${client.config.dashboard.port == 80 ? "" : `:${client.config.dashboard.port}`}/callback`;

  passport.use(new Strategy({
      clientID: client.user.id,
      clientSecret: client.config.bot.info.secret,
      callbackURL: callbackUrl,
      scope: ["identify", "guilds"],
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    },
  ));

  app.use(session({
    store: MongoStore.create({ mongoUrl: client.config.bot.database.mongo_main }),
    secret: client.config.dashboard.secret,
    saveUninitialized: false,
    resave: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.locals.domain = client.config.dashboard.domain.split("//")[1];

  app.set("view engine", "ejs");
  app.set("views", `${__dirname}/templates`);

  app.set('trust proxy', 1);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", express.static(`${__dirname}/assets`));

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
    },
  );

  app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });

  app.get("/", (req, res) => {
    renderTemplate(res, req, "index.ejs", {
      discordInvite: client.config.dashboard.invite,
    });
  });

  app.get("/dashboard", checkAuth, (req, res) => {
    renderTemplate(res, req, "dashboard.ejs", {
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

    renderTemplate(res, req, "settings.ejs", {
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

    renderTemplate(res, req, "settings.ejs", {
      guild,
      settings: {
        prefix: await setting.prefix,
        captcha: await setting.captcha,
        xp: await setting.rank
      },
      alert: "Your settings have been saved.",
    });
  });

  app.listen(client.config.dashboard.port ? client.config.dashboard.port : 3000, null, null, () =>
    console.log(`${colors.fgWhite('Dashboard:')} ${colors.fgGreen('√')} ${colors.fgWhite('||')} ${colors.fgWhite('Port:')} ${colors.fgRed(`${client.config.dashboard.port}`)}`),
  );
};
