const nqnSchema = require("../../models/server/nqn.js");
const client = require("../../index");

module.exports = async(message) => {
    if (message.author.bot || !message.guild) return;

    const nqnData = await nqnSchema.findOne({ Guild: message.guild.id });

    if (!nqnData) return;

    if (!nqnData.Users.includes(message.author.id)) return;

    let msg = message.content;

    let emojis = msg.match(/(?<=:)([^:\s]+)(?=:)/g);

    if (!emojis) return;

    emojis.forEach(m => {
        let emoji = client.emojis.cache.find(x => x.name === m);
        if (!emoji) return;

        let temp = emoji.toString();

        if (new RegExp(temp, "g").test(msg)) msg = msg.replace(new RegExp(temp, "g"), emoji.toString());
        else msg = msg.replace(new RegExp(":" + m + ":", "g"), emoji.toString());;
    });

    if (msg === message.content) return;

    let webhook = await message.channel.fetchWebhooks();
    webhook = webhook.find(wh => wh.token && wh.owner.id === client.user.id);

    if (!webhook) webhook = await message.channel.createWebhook({ name: `${client.user.username}'s Webhook` }).catch(err => console.log(err));

    await message.delete().catch(err => {});

    webhook.send({
        content: msg,
        username: message.member.nickname ? message.member.nickname : message.author.username,
        avatarURL: message.author.displayAvatarURL(),
    }).catch(err => console.log(err));
}