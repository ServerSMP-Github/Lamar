const Strategy = require("passport-discord").Strategy;
const { getWebsite } = require("../assets/api/url");
const colors = require('../assets/api/console');
const MongoStore = require('connect-mongo');
const session = require("express-session");
const passport = require("passport");
const express = require("express");

const app = express();

module.exports = async (client) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  const callbackUrl = `${getWebsite(client)}/callback`;

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
  app.set("views", `${__dirname}/views`);

  app.set('trust proxy', 1);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/", express.static(`${__dirname}/assets`));

  require("./router/dashboard")(app);

  require("./router")(app);

  app.listen(client.config.dashboard.port ? client.config.dashboard.port : 3000, null, null, () =>
    console.log(`${colors.fgWhite('Website:')} ${colors.fgGreen('√')} ${colors.fgWhite('||')} ${colors.fgWhite('Port:')} ${colors.fgRed(`${client.config.dashboard.port}`)}`),
  );
};
