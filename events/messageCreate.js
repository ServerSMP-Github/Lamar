const { MessageEmbed, Collection, WebhookClient } = require('discord.js');
const blacklistserver = require('../models/management/blacklist');
const commandstoggle = require('../models/server/command');
const Userstats = require("../models/user/user-stats"); 
const customcom = require('../models/server/cc');
const client = require("../index");
const Timeout = new Collection();
const ms = require("ms");

client.on("messageCreate", async (message) => {

    if (message.author.bot || !message.guild) return;

    const p = await client.prefix(message);

    const mentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mentionRegex)) return message.channel.send({ content: `Prefix: \`${p}\`` });

    if (!message.content.toLowerCase().startsWith(p)) return;

    const [cmd, ...args] = message.content
        .slice(p.length)
        .trim()
        .split(" ");

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

    const data = await customcom.findOne({ Guild: message.guild.id, Command: cmd }).exec();
    if(data) message.channel.send(data.Response);

    if (!command) return;
    if (command) {

        Userstats.findOne({ User: message.author.id }, async(err, data) => {
          if(data) {
            data.CmdUsed = `${Number(data.CmdUsed) + 1}`;
            data.save();
          }
          if(!data) {
            new Userstats({
              User: message.author.id,
              CmdUsed: "1",
            }).save();
          }
        });

        if (!["anal", "ass", "boobs", "gonewild", "hentai", "hentaiass", "hentaithigh", "ihentai", "kitsune", "lewd", "pgif", "pussy", "thigh", "wallpaper"].includes(command.name)) new WebhookClient({ url: client.config.channel.webhooks.cmdlog }).send({
          embeds: [
            new MessageEmbed()
              .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
              .setDescription(`\`\`\`\n${client.config.bot.info.prefix}${command.name}\n\`\`\``)
              .setColor("YELLOW")
              .setTimestamp()
          ]
        });

        const blacklisted = await blacklistserver.findOne({ Server: message.guild.id }).exec();
        if(blacklisted) return message.reply("This server has been blacklisted.");

        if(!message.member.permissions.has(command.userPermission || [])) return message.channel.send("You do not have permission to use this command!");
        if(!message.guild.me.permissions.has(command.botPermission || [])) return message.channel.send("I do not have permission to use this command!");

        if (command.owner && !client.config.bot.owner.includes(message.author.id)) return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription( "This command can only be used by the owners!" )
          ]
        });

        const check = await commandstoggle.findOne({ Guild: message.guild.id }).exec();
        if(check && check.Cmds.includes(command.name)) return message.channel.send('This command has been disabled by admins.');

        if (command.cooldown) {
            if (Timeout.has(`${command.name}${message.author.id}`))
                return message.channel.send(
                    `You are on a \`${ms(
                        Timeout.get(`${command.name}${message.author.id}`) - Date.now(),
                        { long: true }
                    )}\` cooldown.`
                );
            Timeout.set(
                `${command.name}${message.author.id}`,
                Date.now() + command.cooldown
            );
            setTimeout(() => {
                Timeout.delete(`${command.name}${message.author.id}`);
            }, command.cooldown);
        }

        if(client.config.bot.database.mongo_extra && await client.arkDB.has(`${client.user.username}-cmdUsed`) === true) await client.arkDB.set(`${client.user.username}-cmdUsed`, `${Number(await client.arkDB.get(`${client.user.username}-cmdUsed`)) + 1}`);

        await command.run(client, message, args);

    }
});
