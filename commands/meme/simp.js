const { Message, Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const Schema = require("../../models/user/simplevel");

function mathRandomInt(a, b) {
    if (a > b) {
        var c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
};

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
            const your = mention ? "That user's" :"Your";
            const you = mention ? "that user" : "you";
            const You = mention ? "That user" : "You";
            const youre = mention ? "that user is" : "you're"
            const Youre = mention ? "That user is" : "You're";

            const number = mathRandomInt(0, 1000) === 500 ? 9999 : mathRandomInt(0, 100);

            const text = (number === 9999)
                ? `${your} simp level is... 9999%!\nITS OVER 9 THOUSAND!`
                : (number >= 1 && number <= 15) 
                ? `${your} simp level is... ${number}%!\nOnly a teensy bit of a simp, good for ${you}!`
                : (number >= 16 && number <= 29)
                ? `${your} simp level is... ${number}%!\n${Youre} a bit of a simp, but not enough for it to be an issue!`
                : (number >= 30 && number <= 49)
                ? `${your} simp level is... ${number}%!\nHuh, I guess ${youre} below average in terms simp levels! Not bad, I guess!`
                : (number == 50)
                ? `${your} simp level is... ${number}%!\n${Youre}.. equal levels of simp and non-simp? How does that even work?`
                : (number >= 51 && number <= 68)
                ? `${your} simp level is... ${number}%!\n${You} appear to be a very mild simp!`
                : (number == 69)
                ? `${your} simp level is... ${number}%!\nNice! Well, it would be nice if it didn't mean ${you} were a big ol' simp!`
                : (number > 69)
                ? `${your} simp level is... ${number}%!\nWow! That is a lot of simping.`
                : (number === 100)
                ? `${your} simp level is... ${number}%!\nWow, a total simp! Go watch pokimane or something.`
                : `${your} simp level is... ${number}%!\nNot a single drop of simpiness, impressive!`

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
                const number = mathRandomInt(0, 100);
                simpData = await Schema.create({
                    User: member.user.id,
                    Lowest: number,
                    Highest: number
                });
            }

            const canvas = createCanvas(1280, 720);
            const ctx = canvas.getContext(`2d`);

            const background = await loadImage("./assets/image/simpcard.png");
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
                content: "If your username contains any non-alphabetical characters, it won't show the username.",
                files: [
                    new AttachmentBuilder(canvas.toBuffer(), { name: "simpcard.jpg" })
                ]
            });
        }
    },
};