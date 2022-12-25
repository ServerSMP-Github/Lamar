const CaptchaGenerator = require('../../assets/api/canvas/captcha');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const captchaSchema = require('../../models/moderator/captcha');
const client = require("../../index");

module.exports = async(member) => {
    if (member.user.bot) return;

    const captchaData = await captchaSchema.findOne({ Guild: member.guild.id });
    if (!captchaData) return;

    try {
        const captcha = CaptchaGenerator();

        const msg = await member.send({
            embeds: [
                new EmbedBuilder()
                .setTitle('Please enter the captcha')
                .setImage('attachment://captcha.png')
                .setColor("Random")
            ],
            files: [
                new AttachmentBuilder(captcha.image, { name: "captcha.png" })
            ]
        })

        const filter = m => m.author.id == member.id;

        msg.channel.awaitMessages({
                filter,
                max: 1,
                time: 10000,
                errors: ['time']
            })
            .then(collected => {
                if (collected.first().content == captcha.text) return msg.channel.send("Congrats, you have answered the captcha.");
                else {
                    msg.channel.send("You have answered the captcha incorrectly!");
                    msg.channel.send(`You have been kicked from **${member.guild.name}** for not answering the captcha correctly.`);
                    member.kick();
                }
            })
            .catch(() => {
                msg.channel.send(`You have been kicked from **${member.guild.name}** for not answering the captcha correctly.`);
                member.kick();
            });
    } catch (e) {
        return console.error(e);
    }
}