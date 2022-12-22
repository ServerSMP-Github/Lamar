const { EmbedBuilder, Message, Client, AttachmentBuilder, PermissionsBitField } = require("discord.js");
const { blacklistedwords } = require("../../client/collection");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { drawCard } = require("discord-welcome-card");

const blacklistSchema = require("../../models/moderator/blackwords");
const logDataSchema = require("../../models/logs/logsData");
const goodbyeSchema = require("../../models/logs/goodbye");
const welcomeSchema = require("../../models/logs/welcome");
const prefixSchema = require("../../models/server/prefix");
const cmdSchema = require("../../models/server/command");
const pollSchema = require("../../models/server/poll");
const nqnSchema = require("../../models/server/nqn");

const { randomHexColor } = require("../../assets/api/color");
const { getFileList } = require("../../assets/api/file");

module.exports = {
  name: "options",
  usage: "[ option 1 | ] [ option 2 ] [ option 3 ] [ option 4 ] { To get a list to the options do the command without options (aka: {prefix}options). }",
  description: "Set up some options stuff.",
  userPermission: [PermissionsBitField.Flags.Administrator],
  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {

    const query = args[0]?.toLowerCase();

    const optionsFiles = await getFileList(`${process.cwd()}/commands/utils/options`, { type: ".js", recursively: false });
    return optionsFiles.map((value) => {
      const file = require(value);

      query === file.name ? file.run(client, message, args) : !file.name && !query ? file.run(client, message, args) : null
    });

    if (query === "prefix") {
      if (options === "set") {
        const res = args[2]
        if (!res) return message.channel.send("Please specify a prefix to change to.")
        if (res.match(/^(?:<@!?)?(\d{16,22})>/gi) || res.match(/^(?:<#?)?(\d{16,22})>$/gi) || res.match(/^(?:<:(?![\n])[()#$@-\w]+:?)?(\d{16,22})>$/gi)) return message.reply({
          content: `if u break me i will kill you`
        });
        if (res.length > 10) return message.reply("No prefix longer then 10.")
        prefixSchema.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (err) throw err;
          if (data) {
            await data.delete()
            data = new prefixSchema({
              Guild: message.guild.id,
              Prefix: res
            })
            data.save()
            message.channel.send(`Your prefix has been updated to **${res}**`)
          } else {
            data = new prefixSchema({
              Guild: message.guild.id,
              Prefix: res
            })
            data.save()
            message.channel.send(`Custom prefix in this server is now set to **${res}**`)
          }
        })
      } else if (options === "reset") {
        prefixSchema.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) return message.channel.send("You dont have a custom prefix!");
          data.delete()
          message.channel.send(`The prefix has been reset to ${process.env.PREFIX}`)
        })
      } else return message.reply("Option is not correct!")

    } else if (query === "blacklist") {
      const guild = {
        Guild: message.guild.id
      }
      if (options === "add") {
        const word = args[2]?.toLowerCase();
        if (!word) return message.channel.send("Please specify a word!");
        SchemaBlacklist.findOne(guild, async (err, data) => {
          if (data) {
            if (data.Words.includes(word)) return message.reply("That word already exist in the database.");
            data.Words.push(word);
            data.save();
            blacklistedwords.get(message.guild.id).push(word)
          } else {
            new SchemaBlacklist({
              Guild: message.guild.id,
              Words: word
            }).save();
            blacklistedwords.set(message.guild.id, [word])
          }
          message.reply(`${word} is now blacklisted!`)
        })
      } else if (options === "remove") {
        const word = args[2]?.toLowerCase();
        if (!word) return message.channel.send("Please specify a word!");
        SchemaBlacklist.findOne(guild, async (err, data) => {
          if (!data) return message.reply("This guild has no data in the database!");
          if (!data.Words.includes(word)) return message.channel.send("That word doesnt exist in the database!");
          const filtered = data.Words.filter((target) => target !== word);
          await SchemaBlacklist.findOneAndUpdate(guild, {
            Guild: message.guild.id,
            Words: filtered
          });
          blacklistedwords.set(message.guild.id, filtered)
        });
        message.reply("Word has been removed!");
      } else if (options === "display") {
        SchemaBlacklist.findOne(guild, async (err, data) => {
          if (!data) return message.reply("There is no data.");
          message.channel.send({
            embeds: [
              new EmbedBuilder()
              .setTitle("Blacklisted Words")
              .setDescription(data.Words.join(", "))
            ]
          })
        })
      } else return message.reply("Option is not correct!")

    } else if (query === "goodbye") {
      if (options === "set") {

        return message.channel.send("Goodbye is being re-worked!")
        if (args[2].toLowerCase() === "subtitle") {
          const goodbye_description = args.slice(3).join(" ");
          if (!goodbye_description) return message.reply("Please type what you want the subtitle of the goodbye card to be.")
          if (message.content.length > 220) return message.reply("Subtitle to **long**! (That's what she sayed.)")
          await client.mongo_quick.set(`goodbye-text-${message.guild.id}`, goodbye_description)
          message.channel.send(`Set **${goodbye_description}** to subtitle`)

        } else if (args[2].toLowerCase() === "title") {
          const goodbye_title = args.slice(3).join(" ");
          if (!goodbye_title) return message.reply("Please type what you want the subtitle of the goodbye card to be.")
          if (message.content.length > 220) return message.reply("Title to **long**! (That's what she sayed.)")
          await client.mongo_quick.set(`goodbye-title-${message.guild.id}`, goodbye_title)
          message.channel.send(`Set **${goodbye_description}** to title`)

        } else {
          if (!args[2]) return message.reply("Themes are `dark`, `sakura`, `blue`, `bamboo`, `desert`, `code`")

          const channel = message.mentions.channels.last();
          if (!channel) return message.reply("Please mention a channel!");

          if (args[2].toLowerCase() === "dark") {
            await client.mongo_quick.set(`goodbye-theme-${message.guild.id}`, "dark")
            message.channel.send("Goodbye options set theme to `dark`")

          } else if (args[2].toLowerCase() === "sakura") {
            await client.mongo_quick.set(`goodbye-theme-${message.guild.id}`, "sakura")
            message.channel.send("Goodbye options set theme to `sakura`")

          } else if (args[2].toLowerCase() === "blue") {
            await client.mongo_quick.set(`goodbye-theme-${message.guild.id}`, "blue")
            message.channel.send("Goodbye options set theme to `blue`")

          } else if (args[2].toLowerCase() === "bamboo") {
            await client.mongo_quick.set(`goodbye-theme-${message.guild.id}`, "bamboo")
            message.channel.send("Goodbye options set theme to `bamboo`")

          } else if (args[2].toLowerCase() === "desert") {
            await client.mongo_quick.set(`goodbye-theme-${message.guild.id}`, "desert")
            message.channel.send("Goodbye options set theme to `desert`")

          } else if (args[2].toLowerCase() === "code") {
            await client.mongo_quick.set(`goodbye-theme-${message.guild.id}`, "code")
            message.channel.send("Goodbye options set theme to `code`")

          } else return message.reply("Theme is invalid!")

          SchemaGoodbye.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.save();
            } else {
              new SchemaGoodbye({
                Guild: message.guild.id,
                Channel: channel.id,
              }).save();
            }
            message.reply(`${channel} has been set as the goodbye channel.`)
          })

        }

      } else if (options === "remove") {
        // if (await client.mongo_quick.has(`goodbye-theme-${message.guild.id}`) === true) await client.mongo_quick.remove(`goodbye-theme-${message.guild.id}`)
        // if (await client.mongo_quick.has(`goodbye-title-${message.guild.id}`) === true) await client.mongo_quick.remove(`goodbye-title-${message.guild.id}`)
        // if (await client.mongo_quick.has(`goodbye-text-${member.guild.id}`) === true) await client.mongo_quick.remove(`goodbye-text-${member.guild.id}`)
        SchemaGoodbye.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) return message.reply("Goodbye channel is not set.")
          data.delete()
          message.channel.send("The goodbye channel has been reset!")
        })

      } else if (options === "show") {
        let goodbye_subtitle;
        // if (await client.mongo_quick.has(`goodbye-text-${message.guild.id}`) === true) {
          // goodbye_subtitle = `${await client.mongo_quick.get(`goodbye-text-${message.guild.id}`)}`
        // } else {
          goodbye_subtitle = " "
        // }

        let goodbye_title;
        // if (await client.mongo_quick.has(`goodbye-title-${message.guild.id}`) === true) {
          // goodbye_title = `${await client.mongo_quick.get(`goodbye-title-${message.guild.id}`)}`
        // } else {
          goodbye_title = "Goodbye,"
        // }

        let goodbye_theme;
        // if (await client.mongo_quick.has(`goodbye-theme-${message.guild.id}`) === true) {
          // goodbye_theme = `${await client.mongo_quick.get(`goodbye-theme-${message.guild.id}`)}`
        // } else {
          goodbye_theme = "dark"
        // }

        const user = message.member.user;
        const image = await drawCard({
          blur: true,
          title: goodbye_title,
          theme: goodbye_theme,
          text: `${user.username}#${user.discriminator}!`,
          subtitle: goodbye_subtitle,
          rounded: true,
          border: true,
          avatar: user.displayAvatarURL({
            format: "png"
          })
        });

        const attachment = new AttachmentBuilder(image, { name: "bye.png" });
        message.channel.send({
          files: [attachment]
        });

      } else return message.reply("Option is not correct!")

    } else if (query === "welcome") {
      if (options === "set") {

        if (!args[2]) return message.channel.send("Please specify a welcome card package!")

        if (args[2].toLowerCase() === "popcat") {
          const channel = message.mentions.channels.last();
          if (!channel) return message.reply("Please mention a channel!");

          SchemaWelcome.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.Type = "popcat";
              data.Theme = "null";
              data.Blur = false,
              data.Rounded = false,
              data.Border = false,
              data.Background = "null",
              data.Color = "null",
              data.FontPath = "null",
              data.FontName = "null",
              data.save();
            } else {
              new SchemaWelcome({
                Guild: message.guild.id,
                Channel: channel.id,
                Type: "popcat",
                Theme: "null",
                Title: "null",
                Blur: false,
                Rounded: false,
                Border: false,
                Background: "null",
                Color: "null",
                FontPath: "null",
                FontName: "null",
              }).save();
            }

            message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Welcome Card")
                  .setColor("Random")
                  .addFields(
                    {
                      name: "Package",
                      value: "popcat",
                      inline: true
                    },
                    {
                      name: "Channel",
                      value: String(channel),
                      inline: true
                    }
                  )
                ]
              })
            })

        } else if (args[2]?.toLowerCase() === "discord-welcome-card") {
          if (!args[3]) return message.reply("Themes are `dark`, `circuit`, `code`");

          const channel = message.mentions.channels.last();
          if (!channel) return message.reply("Please mention a channel!");

          let theme = null;
          if (args[3]?.toLowerCase() === "dark") {
            theme = "dark";

          } else if (args[3]?.toLowerCase() === "circuit") {
            theme = "circuit";

          } else if (args[3]?.toLowerCase() === "code") {
            theme = "code";

          } else return message.reply("Welcome theme is invalid!");

          let blur = null;
          if (args[4]?.toLowerCase() === "false") { 
            blur = false;

          } else if (args[4]?.toLowerCase() === "true") {
            blur = true;

          } else return message.reply("Blur settings can only be `true` or `false`");

          let rounded = null;
          if (args[5]?.toLowerCase() === "false") {
            rounded = false;
          
          } else if (args[5]?.toLowerCase() === "true") {
            rounded = true;

          } else return message.reply("Rounded settings can only be `true` or `false`");

          let border = null;
          if (args[6]?.toLowerCase() === "false") {
            border = false;
          
          } else if (args[6]?.toLowerCase() === "true") {
            border = true;

          } else return message.reply("Border settings can only be `true` or `false`");

          SchemaWelcome.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.Type = "discord-welcome-card";
              data.Theme = theme;
              data.Title = "Welcome to this server,"
              data.Blur = blur,
              data.Rounded = rounded,
              data.Border = border,
              data.Background = "null",
              data.Color = "null",
              data.FontPath = "null",
              data.FontName = "null",
              data.save();
            } else {
              new SchemaWelcome({
                Guild: message.guild.id,
                Channel: channel.id,
                Type: "discord-welcome-card",
                Theme: theme,
                Title: "Welcome to this server,",
                Blur: blur,
                Rounded: rounded,
                Border: border,
                Background: "null",
                Color: "null",
                FontPath: "null",
                FontName: "null",
              }).save();
            }
          })

          message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Welcome Card")
                .setColor("Random")
                .addFields(
                  {
                    name: "Package",
                    value: "discord-welcome-card",
                    inline: true
                  },
                  {
                    name: "Channel",
                    value: String(channel),
                    inline: true
                  },
                  {
                    name: "Theme",
                    value: String(theme),
                    inline: true
                  },
                  {
                    name: "Title",
                    value: "Welcome to this server,",
                    inline: true
                  },
                  {
                    name: "Blur",
                    value: String(blur),
                    inline: true
                  },
                  {
                    name: "Rounded",
                    value: String(rounded),
                    inline: true
                  },
                  {
                    name: "Border",
                    value: String(border),
                    inline: true
                  }
                )
            ]
          })

        } else if(args[2]?.toLowerCase() === "swiftcord") {
          const channel = message.mentions.channels.last();
          if (!channel) return message.reply("Please mention a channel!");
          
          let background
          if (args[3]?.toLowerCase() === "default") {
            background = "default"
          
          } else {
            const image = args[3];

            if(!image.startsWith("http") && !image.endsWith(".png") || !image.endsWith(".jpeg") || !image.endsWith(".jpg")) return message.reply("If you want a image it has to start with `http` and end with `.png` or `.jpeg` or `.jpg`, if you dont want an image do `default`");

            if(!isValidHttpUrl(image)) return message.reply("The URL specifyed is invalid.");

            background = image;
          }

          SchemaWelcome.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.Type = "swiftcord";
              data.Theme = "null";
              data.Blur = false,
              data.Rounded = false,
              data.Border = false,
              data.Background = background,
              data.Color = "null",
              data.FontPath = "null",
              data.FontName = "null",
              data.save();
            } else {
              new SchemaWelcome({
                Guild: message.guild.id,
                Channel: channel.id,
                Type: "swiftcord",
                Theme: "null",
                Title: "null",
                Blur: false,
                Rounded: false,
                Border: false,
                Background: background,
                Color: "null",
                FontPath: "null",
                FontName: "null",
              }).save();
            }
          })

          message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Welcome Card")
                .setColor("Random")
                .addFields(
                  {
                    name: "Package",
                    value: "swiftcord",
                    inline: true
                  },
                  {
                    name: "Channel",
                    value: String(channel),
                    inline: true
                  },
                  {
                    name: "Background",
                    value: String(background),
                    inline: true
                  }
                )
            ]
          })

        } else if (args[2]?.toLowerCase() === "discord-welcomer") {
          const channel = message.mentions.channels.last();
          if (!channel) return message.reply("Please mention a channel!");
          
          let background
          if (args[3]?.toLowerCase() === "default") {
            background = "standart";
          
          } else if (args[3]?.toLowerCase() === "invisible") {
            background = "invisible";

          } else {
            const image = args[3];

            if(!image.startsWith("http") && !image.endsWith(".png") || !image.endsWith(".jpeg") || !image.endsWith(".jpg")) return message.reply("If you want a image it has to start with `http` and end with `.png` or `.jpeg` or `.jpg`, if you dont want an image do `default`");

            if(!isValidHttpUrl(image)) return message.reply("The URL specifyed is invalid.");

            background = image;
          }

          SchemaWelcome.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.Type = "discord-welcomer";
              data.Theme = "null";
              data.Title = "welcome <3"
              data.Blur = false,
              data.Rounded = false,
              data.Border = false,
              data.Background = background,
              data.Color = "null",
              data.FontPath = "null",
              data.FontName = "null",
              data.save();
            } else {
              new SchemaWelcome({
                Guild: message.guild.id,
                Channel: channel.id,
                Type: "discord-welcomer",
                Theme: "null",
                Title: "welcome <3",
                Blur: false,
                Rounded: false,
                Border: false,
                Background: background,
                Color: "null",
                FontPath: "null",
                FontName: "null",
              }).save();
            }
          })

          message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Welcome Card")
                .setColor("Random")
                .addFields(
                  {
                    name: "Package",
                    value: "discord-welcomer",
                    inline: true
                  },
                  {
                    name: "Channel",
                    value: String(channel),
                    inline: true
                  },
                  {
                    name: "Background",
                    value: String(background),
                    inline: true
                  },
                  {
                    name: "Title",
                    value: "welcome <3",
                    inline: true
                  }
                )
            ]
          })

        } else if (args[2]?.toLowerCase() === "text") {
          const channel = message.mentions.channels.last();
          if (!channel) return message.reply("Please mention a channel!");

          SchemaWelcome.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.Type = "text";
              data.Theme = "null";
              data.Blur = false,
              data.Rounded = false,
              data.Border = false,
              data.Background = "null",
              data.Color = "null",
              data.FontPath = "null",
              data.FontName = "null",
              data.save();
            } else {
              new SchemaWelcome({
                Guild: message.guild.id,
                Channel: channel.id,
                Type: "text",
                Theme: "null",
                Title: "null",
                Blur: false,
                Rounded: false,
                Border: false,
                Background: "null",
                Color: "null",
                FontPath: "null",
                FontName: "null",
              }).save();
            }
          })

          message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Welcome Card")
                .setColor("Random")
                .addFields(
                  {
                    name: "Package",
                    value: "text (msg)",
                    inline: true
                  },
                  {
                    name: "Channel",
                    value: String(channel),
                    inline: true
                  }
                )
            ]
          })

        } else return message.channel.send("Welcome card package is invalid!")

      } else if (options === "remove") {
        SchemaWelcome.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) return message.reply("Welcome data does not exist!")
          data.delete()
          message.channel.send("Welcome data has been deleted!")
        })

      } else return message.reply("Option is not correct!")

    } else if (query === "list") {

      let xp_command;
      let xp_channel;
      xpSchema.findOne({ Guild: message.guild.id }, async(err, data) => {
        if (!data) {
          xp_command = "`no channel set`";
          xp_channel = false;
        } else {
          xp_command = true;
          xp_channel = `<#${data.Channel}>`
        }
      });

      let nsfw_channel;
      // if (await client.mongo_quick.has(`nsfw-ch-${message.guild.id}`) === false) {
        nsfw_channel = "`no channel set`";
      // } else {
        // nsfw_channel = `<#${await client.mongo_quick.get(`nsfw-ch-${message.guild.id}`)}>`
      // }

      // let autorole;
      // if (await client.mongo_quick.has(`autorole-${message.guild.id}`) === true) {
        // autorole = `<@&${await client.mongo_quick.get(`autorole-${message.guild.id}`)}>`
      // } else {
        autorole = "`no role set`"
      // }

      let invite;
      Schema.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) invite = `<#${data.Channel}>`
        if (!data) invite = "`no channel set`"
        if (err) invite = "`error`"
      });

      let chatbot;
      SchemaChatBot.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) chatbot = `<#${data.Channel}>`
        if (!data) chatbot = "`no channel set`"
        if (err) chatbot = "`error`"
      });

      let modlogs;
      let modlogsoptions;
      SchemaModLogs.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) {
          modlogs = `<#${data.Channel}>`
          modlogsoptions = [
            `*chc*: \`${data.chc ? "false" : "true"}\``,
            `*chd*: \`${data.chd ? "false" : "true"}\``,
            `*chpu*: \`${data.chpu ? "false" : "true"}\``,
            `*chu*: \`${data.chu ? "false" : "true"}\``,
            `*ed*: \`${data.ed ? "false" : "true"}\``,
            `*ec*: \`${data.ec ? "false" : "true"}\``,
            `*eu*: \`${data.eu ? "false" : "true"}\``,
            `*gba*: \`${data.gba ? "false" : "true"}\``,
            `*gbr*: \`${data.gbr ? "false" : "true"}\``,
            `*gma*: \`${data.gma ? "false" : "true"}\``,
            `*gmr*: \`${data.gmr ? "false" : "true"}\``,
            `*gmc*: \`${data.gmc ? "false" : "true"}\``,
            `*gmu*: \`${data.gmu ? "false" : "true"}\``
          ]
        }
        if (!data) modlogs = "`no channel set`"
        if (err) modlogs = "`error`"
      });

      let logData;
      LogData.findOne({ Guild: message.guild.id }, async (err, data) => {
        if (data) logData = "`true`";
        if (!data) logData = "`false`";
        if (err) logData = "`error`";
      });

      let global;
      SchemaGlobal.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) global = `<#${data.Channel}>`
        if (!data) global = "`no channel set`"
        if (err) global = "`error`"
      });

      let goodbye;
      SchemaGoodbye.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) goodbye = `<#${data.Channel}>`
        if (!data) goodbye = "`no channel set`"
        if (err) goodbye = "`error`"
      });

      let welcome;
      SchemaWelcome.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) welcome = `<#${data.Channel}>`
        if (!data) welcome = "`no channel set`"
        if (err) welcome = "`error`"
      });

      let starboard;
      Starboard.findOne({
        Guild: message.guild.id
      }, async (err, data) => {
        if (data) starboard = "`true`";
        if (!data) starboard = "`false`";
        if (err) starboard = "`error`";
      });

      let welcome_type;
      // if (await client.mongo_quick.has(`welcome-type-${message.guild.id}`) === true) {
        // welcome_type = await client.mongo_quick.get(`welcome-type-${message.guild.id}`)
      // } else {
        welcome_type = "welcome type not set"
      // }

      let welcome_theme;
      // if (await client.mongo_quick.has(`welcome-theme-${message.guild.id}`) === true) {
        // welcome_theme = await client.mongo_quick.get(`welcome-theme-${message.guild.id}`)
      // } else {
        welcome_theme = "welcome theme not set"
      // }

      let goodbye_subtitle;
      // if (await client.mongo_quick.has(`goodbye-text-${message.guild.id}`) === true) {
        // goodbye_subtitle = `${await client.mongo_quick.get(`goodbye-text-${message.guild.id}`)}`
      // } else {
        goodbye_subtitle = " "
      // }

      // let goodbye_title;
      // if (await client.mongo_quick.has(`goodbye-title-${message.guild.id}`) === true) {
        // goodbye_title = `${await client.mongo_quick.get(`goodbye-title-${message.guild.id}`)}`
      // } else {
        goodbye_title = "Goodbye,"
      // }

      let goodbye_theme;
      // if (await client.mongo_quick.has(`goodbye-theme-${message.guild.id}`) === true) {
        // goodbye_theme = `${await client.mongo_quick.get(`goodbye-theme-${message.guild.id}`)}`
      // } else {
        goodbye_theme = "dark"
      // }

      const embed = new EmbedBuilder()
        .setTitle("Options")
        .setDescription(`
                **NSFW** - \`????\`
                **NSFW Channel** - ${nsfw_channel}
                **XP** - \`${xp_command}\`
                **XP Channel** - ${xp_channel}
                **Autorole** - ${autorole}
                **Invite** - ${invite}
                **Captcha** - \`????\`
                **Chatbot** - ${chatbot}
                **ModLogs** - ${modlogs}
                **ModLogsOptions:**
                    ${modlogsoptions.join("\n")}
                **Global** - ${global}
                **Prefix** - \`${await client.prefix(message)}\`
                **Goodbye** - ${goodbye}
                **Goodbye Theme** - \`${goodbye_theme}\`
                **Goodbye Main Text** - \`${goodbye_title}\`
                **Goodbye Sub Text** - \`${goodbye_subtitle}\`
                **Welcome** - ${welcome}
                **Welcome Type** - \`${welcome_type}\`
                **Welcome Theme** - \`${welcome_theme}\`
                **Log Data** - ${logData}
                **Starboard** - ${starboard}
                `)
        .setColor("Random")
      await message.channel.send({
        embeds: [embed]
      })
    } else if (query === "cmd") {
      if (options === "enable") {
        const cmd = args[0];
        if (!cmd) return message.channel.send("Please specify a command")
        if (!!client.commands.get(cmd) === false) return message.channel.send("This command does not exist");
        SchemaCMD.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) return message.reply("This server does not have any commands disabled.")
          if (err) throw err;
          if (data) {
            if (data.Cmds.includes(cmd)) {
              let commandNumber;

              for (let i = 0; i < data.Cmds.length; i++) {
                if (data.Cmds[i] === cmd) data.Cmds.splice(i, 1)
              }

              await data.save()
              message.channel.send(`Enabled ${cmd}!`)
            } else return message.channel.send("That command isnt turned off.")
          }
        })
      } else if (options === "disable") {
        const cmd = args[0];
        if (!cmd) return message.channel.send("Please specify a command")
        if (!!client.commands.get(cmd) === false) return message.channel.send("This command does not exist");
        SchemaCMD.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (err) throw err;
          if (data) {
            if (data.Cmds.includes(cmd)) return message.channel.send("This command has already been disabled.");
            data.Cmds.push(cmd)
          } else {
            data = new SchemaCMD({
              Guild: message.guild.id,
              Cmds: cmd
            })
          }
          await data.save();
          message.channel.send(`Command ${cmd} has been disabled`)
        })
      } else return message.reply("Option is not correct!")

    } else if (query === "logdata") {
      if (options === "on") {
        LogData.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) {
            new LogData({
              Guild: message.guild.id,
              Messages: 0,
              MessagesDelete: 0,
              MessagesEdit: 0,
              ChannelCreate: [],
              ChannelDelete: [],
              ChannelPinUpdate: [],
              ChannelUpdate: [],
              EmojiCreate: [],
              EmojiDelete: [],
              EmojiUpdate: [],
              BanAdd: [],
              BanRemove: [],
              MemberAdd: [],
              MemberRemove: [],
              MemberUpdate: [],
            }).save();
            return message.reply("Logging data has been enabled!");
          } else return message.reply("This server already has log data!");
        });

      } else if (options === "off") {
        LogData.findOne({
          Guild: message.guild.id
        }, async (err, data) => {
          if (!data) return message.reply("This server does not have any log data!");
          if (data) {
            await data.delete();
            return message.reply("Logging data has been disabled!");
          }
        });

      } else if (options === "get") {
        if (args[2]?.toLowerCase() === "web") {
          LogData.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {
              let ccNumber = [];
              await data.ChannelCreate.forEach(ccChannel => {
                const parsedMonth = ccChannel.split("-").slice(1);
                ccNumber.push(String(parsedMonth));
              });
              if (ccNumber.length === 0) ccNumber.push("0");

              let cdNumber = [];
              await data.ChannelDelete.forEach(cdChannel => {
                const parsedMonth = cdChannel.split("-").slice(1);
                cdNumber.push(String(parsedMonth));
              });
              if (cdNumber.length === 0) cdNumber.push("0");

              let cpuNumber = [];
              await data.ChannelPinUpdate.forEach(cpuChannel => {
                const parsedMonth = cpuChannel.split("-").slice(1);
                cpuNumber.push(String(parsedMonth));
              });
              if (cpuNumber.length === 0) cpuNumber.push("0");

              let cuNumber = [];
              await data.ChannelUpdate.forEach(cuChannel => {
                const parsedMonth = cuChannel.split("-").slice(1);
                cuNumber.push(String(parsedMonth));
              });
              if (cuNumber.length === 0) cuNumber.push("0");

              let ecNumber = [];
              await data.EmojiCreate.forEach(ecEmoji => {
                const parsedMonth = ecEmoji.split("-").slice(1);
                ecNumber.push(String(parsedMonth));
              });
              if (ecNumber.length === 0) ecNumber.push("0");

              let edNumber = [];
              await data.EmojiDelete.forEach(edEmoji => {
                const parsedMonth = edEmoji.split("-").slice(1);
                edNumber.push(String(parsedMonth));
              });
              if (edNumber.length === 0) edNumber.push("0");

              let euNumber = [];
              await data.EmojiUpdate.forEach(euEmoji => {
                const parsedMonth = euEmoji.split("-").slice(1);
                euNumber.push(String(parsedMonth));
              });
              if (euNumber.length === 0) euNumber.push("0");

              let baNumber = [];
              await data.BanAdd.forEach(baBan => {
                const parsedMonth = baBan.split("-").slice(1);
                baNumber.push(String(parsedMonth));
              });
              if (baNumber.length === 0) baNumber.push("0");

              let brNumber = [];
              await data.BanRemove.forEach(brBan => {
                const parsedMonth = brBan.split("-").slice(1);
                brNumber.push(String(parsedMonth));
              });
              if (brNumber.length === 0) brNumber.push("0");

              let maNumber = [];
              await data.MemberAdd.forEach(maMember => {
                const parsedMonth = maMember.split("-").slice(1);
                maNumber.push(String(parsedMonth));
              });
              if (maNumber.length === 0) maNumber.push("0");

              let mrNumber = [];
              await data.MemberRemove.forEach(mrMember => {
                const parsedMonth = mrMember.split("-").slice(1);
                mrNumber.push(String(parsedMonth));
              });
              if (mrNumber.length === 0) mrNumber.push("0");

              let muNumber = [];
              await data.MemberUpdate.forEach(muMember => {
                const parsedMonth = muMember.split("-").slice(1);
                muNumber.push(String(parsedMonth));
              });
              if (muNumber.length === 0) muNumber.push("0");

              const newUrl = encodeURI(`https://serversmp-api.herokuapp.com/bot/data?cc=${ccNumber}&cd=${cdNumber}&cpu=${cpuNumber}&cu=${cuNumber}&ec=${ecNumber}&ed=${edNumber}&eu=${euNumber}&ba=${baNumber}&br=${brNumber}&ma=${maNumber}&mr=${mrNumber}&mu=${muNumber}&msg=${data.Messages}&msgdel=${data.MessagesDelete}&msgedit=${data.MessagesEdit}&name=${message.guild.name}&channels=${message.guild.channels.cache.size}&users=${message.guild.members.cache.size}&roles=${message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).length}`);

              if (newUrl.length > 4000) {
                message.reply("Please wait, link way not work");
                const uriData = await shorten(newUrl);
                return message.reply(`https://1pt.co/${uriData}`);
              } else return message.reply(newUrl);

            } else return message.reply("This server does not have server data collection enabled.");
          });

        } else if (args[2]?.toLowerCase() === "msg") {
          LogData.findOne({
            Guild: message.guild.id
          }, async (err, data) => {
            if (data) {

              let ccNumber = [];
              await data.ChannelCreate.forEach(ccChannel => {
                const parsedMonth = ccChannel.split("-").slice(1);
                ccNumber.push(String(parsedMonth));
              });
              if (ccNumber.length === 0) ccNumber.push("0");

              let cdNumber = [];
              await data.ChannelDelete.forEach(cdChannel => {
                const parsedMonth = cdChannel.split("-").slice(1);
                cdNumber.push(String(parsedMonth));
              });
              if (cdNumber.length === 0) cdNumber.push("0");

              let cpuNumber = [];
              await data.ChannelPinUpdate.forEach(cpuChannel => {
                const parsedMonth = cpuChannel.split("-").slice(1);
                cpuNumber.push(String(parsedMonth));
              });
              if (cpuNumber.length === 0) cpuNumber.push("0");

              let cuNumber = [];
              await data.ChannelUpdate.forEach(cuChannel => {
                const parsedMonth = cuChannel.split("-").slice(1);
                cuNumber.push(String(parsedMonth));
              });
              if (cuNumber.length === 0) cuNumber.push("0");

              let ecNumber = [];
              await data.EmojiCreate.forEach(ecEmoji => {
                const parsedMonth = ecEmoji.split("-").slice(1);
                ecNumber.push(String(parsedMonth));
              });
              if (ecNumber.length === 0) ecNumber.push("0");

              let edNumber = [];
              await data.EmojiDelete.forEach(edEmoji => {
                const parsedMonth = edEmoji.split("-").slice(1);
                edNumber.push(String(parsedMonth));
              });
              if (edNumber.length === 0) edNumber.push("0");

              let euNumber = [];
              await data.EmojiUpdate.forEach(euEmoji => {
                const parsedMonth = euEmoji.split("-").slice(1);
                euNumber.push(String(parsedMonth));
              });
              if (euNumber.length === 0) euNumber.push("0");

              let baNumber = [];
              await data.BanAdd.forEach(baBan => {
                const parsedMonth = baBan.split("-").slice(1);
                baNumber.push(String(parsedMonth));
              });
              if (baNumber.length === 0) baNumber.push("0");

              let brNumber = [];
              await data.BanRemove.forEach(brBan => {
                const parsedMonth = brBan.split("-").slice(1);
                brNumber.push(String(parsedMonth));
              });
              if (brNumber.length === 0) brNumber.push("0");

              let maNumber = [];
              await data.MemberAdd.forEach(maMember => {
                const parsedMonth = maMember.split("-").slice(1);
                maNumber.push(String(parsedMonth));
              });
              if (maNumber.length === 0) maNumber.push("0");

              let mrNumber = [];
              await data.MemberRemove.forEach(mrMember => {
                const parsedMonth = mrMember.split("-").slice(1);
                mrNumber.push(String(parsedMonth));
              });
              if (mrNumber.length === 0) mrNumber.push("0");

              let muNumber = [];
              await data.MemberUpdate.forEach(muMember => {
                const parsedMonth = muMember.split("-").slice(1);
                muNumber.push(String(parsedMonth));
              });
              if (muNumber.length === 0) muNumber.push("0");

              // ChannelCreate

              let ccMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedCC = String(ccNumber).split(",");
              parsedCC.forEach(ccData => {
                if (ccData === "01") ccMonth.january.push("1");
                else if (ccData === "02") ccMonth.february.push("1");
                else if (ccData === "03") ccMonth.march.push("1");
                else if (ccData === "04") ccMonth.april.push("1");
                else if (ccData === "05") ccMonth.may.push("1");
                else if (ccData === "06") ccMonth.june.push("1");
                else if (ccData === "07") ccMonth.july.push("1");
                else if (ccData === "08") ccMonth.august.push("1");
                else if (ccData === "09") ccMonth.september.push("1");
                else if (ccData === "10") ccMonth.october.push("1");
                else if (ccData === "11") ccMonth.november.push("1");
                else if (ccData === "12") ccMonth.december.push("1");
              });

              // ChannelDelete

              let cdMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedCD = String(cdNumber).split(",");
              parsedCD.forEach(cdData => {
                if (cdData === "01") cdMonth.january.push("1");
                else if (cdData === "02") cdMonth.february.push("1");
                else if (cdData === "03") cdMonth.march.push("1");
                else if (cdData === "04") cdMonth.april.push("1");
                else if (cdData === "05") cdMonth.may.push("1");
                else if (cdData === "06") cdMonth.june.push("1");
                else if (cdData === "07") cdMonth.july.push("1");
                else if (cdData === "08") cdMonth.august.push("1");
                else if (cdData === "09") cdMonth.september.push("1");
                else if (cdData === "10") cdMonth.october.push("1");
                else if (cdData === "11") cdMonth.november.push("1");
                else if (cdData === "12") cdMonth.december.push("1");
              });

              // ChannelPinUpdate

              let cpuMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedCPU = String(cpuNumber).split(",");
              parsedCPU.forEach(cpuData => {
                if (cpuData === "01") cpuMonth.january.push("1");
                else if (cpuData === "02") cpuMonth.february.push("1");
                else if (cpuData === "03") cpuMonth.march.push("1");
                else if (cpuData === "04") cpuMonth.april.push("1");
                else if (cpuData === "05") cpuMonth.may.push("1");
                else if (cpuData === "06") cpuMonth.june.push("1");
                else if (cpuData === "07") cpuMonth.july.push("1");
                else if (cpuData === "08") cpuMonth.august.push("1");
                else if (cpuData === "09") cpuMonth.september.push("1");
                else if (cpuData === "10") cpuMonth.october.push("1");
                else if (cpuData === "11") cpuMonth.november.push("1");
                else if (cpuData === "12") cpuMonth.december.push("1");
              });

              // ChannelUpdate

              let cuMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedCU = String(cuNumber).split(",");
              parsedCU.forEach(cuData => {
                if (cuData === "01") cuMonth.january.push("1");
                else if (cuData === "02") cuMonth.february.push("1");
                else if (cuData === "03") cuMonth.march.push("1");
                else if (cuData === "04") cuMonth.april.push("1");
                else if (cuData === "05") cuMonth.may.push("1");
                else if (cuData === "06") cuMonth.june.push("1");
                else if (cuData === "07") cuMonth.july.push("1");
                else if (cuData === "08") cuMonth.august.push("1");
                else if (cuData === "09") cuMonth.september.push("1");
                else if (cuData === "10") cuMonth.october.push("1");
                else if (cuData === "11") cuMonth.november.push("1");
                else if (cuData === "12") cuMonth.december.push("1");
              });

              // EmojiCreate

              let ecMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedEC = String(ecNumber).split(",");
              parsedEC.forEach(ecData => {
                if (ecData === "01") ecMonth.january.push("1");
                else if (ecData === "02") ecMonth.february.push("1");
                else if (ecData === "03") ecMonth.march.push("1");
                else if (ecData === "04") ecMonth.april.push("1");
                else if (ecData === "05") ecMonth.may.push("1");
                else if (ecData === "06") ecMonth.june.push("1");
                else if (ecData === "07") ecMonth.july.push("1");
                else if (ecData === "08") ecMonth.august.push("1");
                else if (ecData === "09") ecMonth.september.push("1");
                else if (ecData === "10") ecMonth.october.push("1");
                else if (ecData === "11") ecMonth.november.push("1");
                else if (ecData === "12") ecMonth.december.push("1");
              });

              // EmojiDelete

              let edMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedED = String(edNumber).split(",");
              parsedED.forEach(edData => {
                if (edData === "01") edMonth.january.push("1");
                else if (edData === "02") edMonth.february.push("1");
                else if (edData === "03") edMonth.march.push("1");
                else if (edData === "04") edMonth.april.push("1");
                else if (edData === "05") edMonth.may.push("1");
                else if (edData === "06") edMonth.june.push("1");
                else if (edData === "07") edMonth.july.push("1");
                else if (edData === "08") edMonth.august.push("1");
                else if (edData === "09") edMonth.september.push("1");
                else if (edData === "10") edMonth.october.push("1");
                else if (edData === "11") edMonth.november.push("1");
                else if (edData === "12") edMonth.december.push("1");
              });

              // EmojiUpdate

              let euMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedEU = String(euNumber).split(",");
              parsedEU.forEach(euData => {
                if (euData === "01") euMonth.january.push("1");
                else if (euData === "02") euMonth.february.push("1");
                else if (euData === "03") euMonth.march.push("1");
                else if (euData === "04") euMonth.april.push("1");
                else if (euData === "05") euMonth.may.push("1");
                else if (euData === "06") euMonth.june.push("1");
                else if (euData === "07") euMonth.july.push("1");
                else if (euData === "08") euMonth.august.push("1");
                else if (euData === "09") euMonth.september.push("1");
                else if (euData === "10") euMonth.october.push("1");
                else if (euData === "11") euMonth.november.push("1");
                else if (euData === "12") euMonth.december.push("1");
              });

              // BanAdd

              let baMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedBA = String(baNumber).split(",");
              parsedBA.forEach(baData => {
                if (baData === "01") baMonth.january.push("1");
                else if (baData === "02") baMonth.february.push("1");
                else if (baData === "03") baMonth.march.push("1");
                else if (baData === "04") baMonth.april.push("1");
                else if (baData === "05") baMonth.may.push("1");
                else if (baData === "06") baMonth.june.push("1");
                else if (baData === "07") baMonth.july.push("1");
                else if (baData === "08") baMonth.august.push("1");
                else if (baData === "09") baMonth.september.push("1");
                else if (baData === "10") baMonth.october.push("1");
                else if (baData === "11") baMonth.november.push("1");
                else if (baData === "12") baMonth.december.push("1");
              });

              // BanAdd

              let brMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedBR = String(brNumber).split(",");
              parsedBR.forEach(brData => {
                if (brData === "01") brMonth.january.push("1");
                else if (brData === "02") brMonth.february.push("1");
                else if (brData === "03") brMonth.march.push("1");
                else if (brData === "04") brMonth.april.push("1");
                else if (brData === "05") brMonth.may.push("1");
                else if (brData === "06") brMonth.june.push("1");
                else if (brData === "07") brMonth.july.push("1");
                else if (brData === "08") brMonth.august.push("1");
                else if (brData === "09") brMonth.september.push("1");
                else if (brData === "10") brMonth.october.push("1");
                else if (brData === "11") brMonth.november.push("1");
                else if (brData === "12") brMonth.december.push("1");
              });

              // MemberAdd

              let maMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedMA = String(maNumber).split(",");
              parsedMA.forEach(maData => {
                if (maData === "01") maMonth.january.push("1");
                else if (maData === "02") maMonth.february.push("1");
                else if (maData === "03") maMonth.march.push("1");
                else if (maData === "04") maMonth.april.push("1");
                else if (maData === "05") maMonth.may.push("1");
                else if (maData === "06") maMonth.june.push("1");
                else if (maData === "07") maMonth.july.push("1");
                else if (maData === "08") maMonth.august.push("1");
                else if (maData === "09") maMonth.september.push("1");
                else if (maData === "10") maMonth.october.push("1");
                else if (maData === "11") maMonth.november.push("1");
                else if (maData === "12") maMonth.december.push("1");
              });

              // MemberRemove

              let mrMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedMR = String(mrNumber).split(",");
              parsedMR.forEach(mrData => {
                if (mrData === "01") mrMonth.january.push("1");
                else if (mrData === "02") mrMonth.february.push("1");
                else if (mrData === "03") mrMonth.march.push("1");
                else if (mrData === "04") mrMonth.april.push("1");
                else if (mrData === "05") mrMonth.may.push("1");
                else if (mrData === "06") mrMonth.june.push("1");
                else if (mrData === "07") mrMonth.july.push("1");
                else if (mrData === "08") mrMonth.august.push("1");
                else if (mrData === "09") mrMonth.september.push("1");
                else if (mrData === "10") mrMonth.october.push("1");
                else if (mrData === "11") mrMonth.november.push("1");
                else if (mrData === "12") mrMonth.december.push("1");
              });

              // MemberUpdate

              let muMonth = {
                "january": [],
                "february": [],
                "march": [],
                "april": [],
                "may": [],
                "june": [],
                "july": [],
                "august": [],
                "september": [],
                "october": [],
                "november": [],
                "december": [],
              }

              const parsedMU = String(muNumber).split(",");
              parsedMU.forEach(muData => {
                if (muData === "01") muMonth.january.push("1");
                else if (muData === "02") muMonth.february.push("1");
                else if (muData === "03") muMonth.march.push("1");
                else if (muData === "04") muMonth.april.push("1");
                else if (muData === "05") muMonth.may.push("1");
                else if (muData === "06") muMonth.june.push("1");
                else if (muData === "07") muMonth.july.push("1");
                else if (muData === "08") muMonth.august.push("1");
                else if (muData === "09") muMonth.september.push("1");
                else if (muData === "10") muMonth.october.push("1");
                else if (muData === "11") muMonth.november.push("1");
                else if (muData === "12") muMonth.december.push("1");
              });

              const chart = new ChartJSNodeCanvas({
                width: 800,
                height: 600,
                backgroundColour: "#2F3136"
              });

              const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

              const channelsChart = await chart.renderToBuffer({
                type: "bar",
                data: {
                  datasets: [
                    {
                      label: "Channels Created",
                      data: [Number(ccMonth.january.length), Number(ccMonth.february.length), Number(ccMonth.march.length), Number(ccMonth.april.length), Number(ccMonth.may.length), Number(ccMonth.june.length), Number(ccMonth.july.length), Number(ccMonth.august.length), Number(ccMonth.september.length), Number(ccMonth.october.length), Number(ccMonth.november.length), Number(ccMonth.december.length)],
                      backgroundColor: "#3f51b5",
                    },
                    {
                      label: "Channels Deleted",
                      data: [Number(cdMonth.january.length), Number(cdMonth.february.length), Number(cdMonth.march.length), Number(cdMonth.april.length), Number(cdMonth.may.length), Number(cdMonth.june.length), Number(cdMonth.july.length), Number(cdMonth.august.length), Number(cdMonth.september.length), Number(cdMonth.october.length), Number(cdMonth.november.length), Number(cdMonth.december.length)],
                      backgroundColor: "#2196f3",
                    },
                    {
                      label: "Channels Pin Update",
                      data: [Number(cpuMonth.january.length), Number(cpuMonth.february.length), Number(cpuMonth.march.length), Number(cpuMonth.april.length), Number(cpuMonth.may.length), Number(cpuMonth.june.length), Number(cpuMonth.july.length), Number(cpuMonth.august.length), Number(cpuMonth.september.length), Number(cpuMonth.october.length), Number(cpuMonth.november.length), Number(cpuMonth.december.length)],
                      backgroundColor: "#03a9f4",
                    },
                    {
                      label: "Channels Update",
                      data: [Number(cuMonth.january.length), Number(cuMonth.february.length), Number(cuMonth.march.length), Number(cuMonth.april.length), Number(cuMonth.may.length), Number(cuMonth.june.length), Number(cuMonth.july.length), Number(cuMonth.august.length), Number(cuMonth.september.length), Number(cuMonth.october.length), Number(cuMonth.november.length), Number(cuMonth.december.length)],
                      backgroundColor: "#00bcd4",
                    }
                ],
                  labels: monthsArray,
                }
              });
              const channelsAttachment = new AttachmentBuilder(channelsChart, { name: "channels.png" });

              const emojiChart = await chart.renderToBuffer({
                type: "bar",
                data: {
                  datasets: [
                    {
                      label: "Emoji Created",
                      data: [Number(ecMonth.january.length), Number(ecMonth.february.length), Number(ecMonth.march.length), Number(ecMonth.april.length), Number(ecMonth.may.length), Number(ecMonth.june.length), Number(ecMonth.july.length), Number(ecMonth.august.length), Number(ecMonth.september.length), Number(ecMonth.october.length), Number(ecMonth.november.length), Number(ecMonth.december.length)],
                      backgroundColor: "#3f51b5",
                    },
                    {
                      label: "Emoji Deleted",
                      data: [Number(edMonth.january.length), Number(edMonth.february.length), Number(edMonth.march.length), Number(edMonth.april.length), Number(edMonth.may.length), Number(edMonth.june.length), Number(edMonth.july.length), Number(edMonth.august.length), Number(edMonth.september.length), Number(edMonth.october.length), Number(edMonth.november.length), Number(edMonth.december.length)],
                      backgroundColor: "#2196f3",
                    },
                    {
                      label: "Emoji Update",
                      data: [Number(euMonth.january.length), Number(euMonth.february.length), Number(euMonth.march.length), Number(euMonth.april.length), Number(euMonth.may.length), Number(euMonth.june.length), Number(euMonth.july.length), Number(euMonth.august.length), Number(euMonth.september.length), Number(euMonth.october.length), Number(euMonth.november.length), Number(euMonth.december.length)],
                      backgroundColor: "#03a9f4",
                    }
                ],
                  labels: monthsArray,
                }
              });
              const emojiAttachment = new AttachmentBuilder(emojiChart, { name: "emoji.png" });

              const memberChart = await chart.renderToBuffer({
                type: "bar",
                data: {
                  datasets: [
                    {
                      label: "Members Joined",
                      data: [Number(maMonth.january.length), Number(maMonth.february.length), Number(maMonth.march.length), Number(maMonth.april.length), Number(maMonth.may.length), Number(maMonth.june.length), Number(maMonth.july.length), Number(maMonth.august.length), Number(maMonth.september.length), Number(maMonth.october.length), Number(maMonth.november.length), Number(maMonth.december.length)],
                      backgroundColor: "#3f51b5",
                    },
                    {
                      label: "Members Left",
                      data: [Number(mrMonth.january.length), Number(mrMonth.february.length), Number(mrMonth.march.length), Number(mrMonth.april.length), Number(mrMonth.may.length), Number(mrMonth.june.length), Number(mrMonth.july.length), Number(mrMonth.august.length), Number(mrMonth.september.length), Number(mrMonth.october.length), Number(mrMonth.november.length), Number(mrMonth.december.length)],
                      backgroundColor: "#2196f3",
                    },
                    {
                      label: "Members Update",
                      data: [Number(muMonth.january.length), Number(muMonth.february.length), Number(muMonth.march.length), Number(muMonth.april.length), Number(muMonth.may.length), Number(muMonth.june.length), Number(muMonth.july.length), Number(muMonth.august.length), Number(muMonth.september.length), Number(muMonth.october.length), Number(muMonth.november.length), Number(muMonth.december.length)],
                      backgroundColor: "#03a9f4",
                    },
                    {
                      label: "Members Banned",
                      data: [Number(baMonth.january.length), Number(baMonth.february.length), Number(baMonth.march.length), Number(baMonth.april.length), Number(baMonth.may.length), Number(baMonth.june.length), Number(baMonth.july.length), Number(baMonth.august.length), Number(baMonth.september.length), Number(baMonth.october.length), Number(baMonth.november.length), Number(baMonth.december.length)],
                      backgroundColor: "#00bed4",
                    },
                    {
                      label: "Members Unbanned",
                      data: [Number(brMonth.january.length), Number(brMonth.february.length), Number(brMonth.march.length), Number(brMonth.april.length), Number(brMonth.may.length), Number(brMonth.june.length), Number(brMonth.july.length), Number(brMonth.august.length), Number(brMonth.september.length), Number(brMonth.october.length), Number(brMonth.november.length), Number(brMonth.december.length)],
                      backgroundColor: "#0c6b64",
                    }
                ],
                  labels: monthsArray,
                }
              });
              const memberAttachment = new AttachmentBuilder(memberChart, { name: "member.png" });

              const randomColor = randomHexColor();

              const embed = new EmbedBuilder()
                .setTitle(message.guild.name)
                .setThumbnail(message.guild.iconURL())
                .setColor(randomColor)
                .addFields({
                  name: "Users",
                  value: String(message.guild.members.cache.size),
                  inline: true
                }, {
                  name: "Roles",
                  value: String(message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).length),
                  inline: true
                }, {
                  name: "Channels",
                  value: String(message.guild.channels.cache.size),
                  inline: true
                }, {
                  name: "Messages",
                  value: String(data.Messages),
                  inline: true
                }, {
                  name: "Messages Deleted",
                  value: String(data.MessagesDelete),
                  inline: true
                }, {
                  name: "Messages Edited",
                  value: String(data.MessagesEdit),
                  inline: true
                })

              const channelsEmbed = new EmbedBuilder()
                .setAuthor({
                  name: "Channels Data"
                })
                .setImage("attachment://channels.png")
                .setColor(randomColor)

              const emojiEmbed = new EmbedBuilder()
                .setAuthor({
                  name: "Emoji Data"
                })
                .setImage("attachment://emoji.png")
                .setColor(randomColor)

              const memberEmbed = new EmbedBuilder()
                .setAuthor({
                  name: "Members Data"
                })
                .setImage("attachment://member.png")
                .setColor(randomColor)

              message.channel.send({
                embeds: [
                  embed,
                  channelsEmbed,
                  emojiEmbed,
                  memberEmbed
                ],
                files: [
                  channelsAttachment,
                  emojiAttachment,
                  memberAttachment
                ]
              });

            } else return message.reply("This server does not have server data collection enabled.");
          });

        } else return message.reply("Option is not correct!")

      } else return message.reply("Option is not correct!")

    } else if (query === "nqn") {
      if (options === "on") {
        SchemaNQN.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (data) return message.reply("NQN is allready on!");
          if (!data) {
            new SchemaNQN({
              Guild: message.guild.id,
              Users: [],
            }).save();
            return message.reply("NQN is turned on!");
          }
        });

      } else if (option === "off") {
        SchemaNQN.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (!data) return message.reply("NQN is allready off!");
          if (data) {
            data.delete();
            return message.reply("NQN is turned off!");
          }
        });

      } else return message.reply("Option is not correct!")

    } else if (query === "advanced-poll") {
      if (options === "on" || options === "add") {
        const channel = message.mentions.channels.last();
        if (!channel) return message.reply("Please mention a channel!");

        SchemaPoll.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (!data) {
            new SchemaPoll({
              Guild: message.guild.id,
              Channels: [`${channel.id}`],
            }).save();
            message.reply("Advanced Poll has been enabled!");
          } else {
            data.Channels.push(channel.id);
            data.save();
            message.reply(`Added channel ${channel} to the list!`);
          }
        });

      } else if (options === "rmv") {
        SchemaPoll.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (!data) return message.reply("This server does not have any advanced poll!");
          if (data) {
            const channel = message.mentions.channels.last();
            if (!channel) return message.reply("Please mention a channel!");
            const index = data.Channels.indexOf(channel.id);
            if (index > -1) {
              data.Channels.splice(index, 1);
              data.save();
              message.reply(`Removed channel ${channel} from the list!`);
            } else return message.reply("This channel is not in the list!");
          }
        });

      } else if (options === "off") {
        SchemaPoll.findOne({ Guild: message.guild.id }, async(err, data) => {
          if (!data) return message.reply("Advanced Poll is allready off!");
          if (data) {
            data.delete();
            return message.reply("Advanced Poll is turned off!");
          }
        });

      } else return message.reply("Option is not correct!");

    } else return message.reply("Query is not correct!")
  }
}

async function shorten(url) {
  const response = await (await fetch(encodeURI(`https://api.1pt.co/addURL?long=${url}`))).json();
  if (response.status !== 201) return shorten(url);
  return response.short;
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}