const { Message, Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { getRandomInt } = require("../../assets/api/crypto");
const Schema = require("../../models/user/simplevel");

module.exports = {
    name: 'simp',
    description: "Show's your simp level or your simp card.",
    usage: "[ level or card ] [ @user or nothing ]",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const query = args[0]?.toLowerCase();

        const mention = message.mentions.members.last() || message.guild.members.cache.get(args[1])
        const member = mention || message.member;
        if (!member) return;

        if (query === "level") {
            const userPrefix = mention ? "That user's" : "Your";
            const userPronoun = mention ? "that user" : "you";
            const userCapitalized = mention ? "That user" : "You";
            const userIs = mention ? "that user is" : "you're";
            const userIsCapitalized = mention ? "That user is" : "You're";

            const number = getRandomInt(0, 1000) === 500 ? 9999 : getRandomInt(0, 100);

            const text = (number === 9999)
                ? `${userPrefix} simp level is... 9999%!\nITS OVER 9 THOUSAND!`
                : (number >= 1 && number <= 15) 
                ? `${userPrefix} simp level is... ${number}%!\nOnly a teensy bit of a simp, good for ${userPronoun}!`
                : (number >= 16 && number <= 29)
                ? `${userPrefix} simp level is... ${number}%!\n${userIsCapitalized} a bit of a simp, but not enough for it to be an issue!`
                : (number >= 30 && number <= 49)
                ? `${userPrefix} simp level is... ${number}%!\nHuh, I guess ${userIs} below average in terms simp levels! Not bad, I guess!`
                : (number == 50)
                ? `${userPrefix} simp level is... ${number}%!\n${userIsCapitalized}.. equal levels of simp and non-simp? How does that even work?`
                : (number >= 51 && number <= 68)
                ? `${userPrefix} simp level is... ${number}%!\n${userCapitalized} appear to be a very mild simp!`
                : (number == 69)
                ? `${userPrefix} simp level is... ${number}%!\nNice! Well, it would be nice if it didn't mean ${userPronoun} were a big ol' simp!`
                : (number > 69)
                ? `${userPrefix} simp level is... ${number}%!\nWow! That is a lot of simping.`
                : (number === 100)
                ? `${userPrefix} simp level is... ${number}%!\nWow, a total simp! Go watch pokimane or something.`
                : `${userPrefix} simp level is... ${number}%!\nNot a single drop of simpiness, impressive!`

            const simpData = await Schema.findOne({ User: member.user.id });

            if (!simpData) await Schema.create({
                User: member.user.id,
                Lowest: number,
                Highest: number
            });

            if (simpData) {
                if (simpData.Lowest > number) simpData.Lowest = number;
                if (simpData.Highest < number) simpData.Highest = number;
                await simpData.save();
            }

            message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("SimpLevel")
                    .setDescription(text)
                ]
            });

        } else if (query === "card") {
            let simpData = await Schema.findOne({ User: member.user.id });

            if (!simpData) {
                const number = getRandomInt(0, 100);
                simpData = await Schema.create({
                    User: member.user.id,
                    Lowest: number,
                    Highest: number
                });
            }

            const canvas = createCanvas(1280, 720);
            const ctx = canvas.getContext(`2d`);

            const background = await loadImage("./assets/image/simpcard.webp");
            ctx.drawImage(background, 0, 0, 1280, 720);

            const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", dynamic: false }));
            ctx.drawImage(avatar, 100, 75, 320, 360)

            ctx.font = "45px Amaranth";
            ctx.fillText(`${member.user.username}`, 230, 505);
            ctx.fillText(`${message.createdAt.toLocaleDateString()}`, 75, 620);

            ctx.font = "45px Amaranth";
            ctx.textAlign = "left";
            ctx.fillText(`${simpData.Lowest}%`, 244, 660);
            ctx.fillText(`${simpData.Highest}%`, 302, 703);

            message.channel.send({
                files: [
                    new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "simpcard.jpg" })
                ]
            });
        }
    },
};