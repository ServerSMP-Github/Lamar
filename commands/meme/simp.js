const {
    Message,
    Client,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    MessageAttachment
} = require("discord.js");
const Canvas = require("canvas");
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

        const member = message.mentions.members.last() || message.guild.members.cache.get(args[1]) || message.member;
        if (!member) return;

        if (query === "level") {
            let your = "Your";
            let you = "you";
            let You = "You";
            let youre = "you're"
            let Youre = "You're";
            if (message.mentions.members.last() || message.guild.members.cache.get(args[1])) {
                your = "That user's";
                you = "that user";
                You = "That user";
                youre = "that user is";
                Youre = "That user is";
            }

            let text = "An error has occurred while getting your simplevel.";

            const random_simp = mathRandomInt(0, 100);
            const big_simp = mathRandomInt(0, 1000);
            let number = random_simp;

            if (random_simp >= 1 && random_simp <= 15) {
                text = `${your} simp level is... ${random_simp}%!\nOnly a teensy bit of a simp, good for ${you}!`;
            } else if (random_simp >= 16 && random_simp <= 29) {
                text = `${your} simp level is... ${random_simp}%!\n${Youre} a bit of a simp, but not enough for it to be an issue!`;
            } else if (random_simp >= 30 && random_simp <= 49) {
                text = `${your} simp level is... ${random_simp}%!\nHuh, I guess ${youre} below average in terms simp levels! Not bad, I guess!`;
            } else if (random_simp == 50) {
                text = `${your} simp level is... ${random_simp}%!\n${Youre}.. equal levels of simp and non-simp? How does that even work?`;
            } else if (random_simp >= 51 && random_simp <= 68) {
                text = `${your} simp level is... ${random_simp}%!\n${You} appear to be a very mild simp!`;
            } else if (random_simp == 69) {
                text = `${your} simp level is... ${random_simp}%!\nNice! Well, it would be nice if it didn't mean ${you} were a big ol' simp!`;
            } else if (random_simp > 69) {
                text = `${your} simp level is... ${random_simp}%!\nWow! That is a lot of simping.`;
            } else if (random_simp === 100) {
                text = `${your} simp level is... ${random_simp}%!\nWow, a total simp! Go watch pokimane or something.`;
            } else {
                text = `${your} simp level is... ${random_simp}%!\nNot a single drop of simpiness, impressive!`;
            }

            if (big_simp === 500) {
                number = 9999
                text = `${user} simp level is... 9999%!\nITS OVER 9 THOUSAND!`;
            }

            Schema.findOne({
                User: member.user.id,
            }, (err, data) => {
                if (!data) {
                    new Schema({
                        User: member.user.id,
                        Lowest: Number(number),
                        Highest: Number(number),
                    }).save();
                } else {
                    if (data.Lowest > number) data.Lowest = Number(number);
                    if (data.Highest < number) data.Highest = Number(number);
                    data.save();
                }
            });

            message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("SimpLevel")
                    .setDescription(text)
                ]
            });

        } else if (query === "card") {
            Schema.findOne({
                User: member.user.id
            }, async (err, data) => {
                if (err) return message.reply("An error occurred.");
                if (!data) {
                    const number = await mathRandomInt(0, 100)
                    data = new Schema({
                        User: member.user.id,
                        Lowest: Number(number),
                        Highest: Number(number),
                    }).save();
                }
                const avatar = await Canvas.loadImage(
                    member.user.displayAvatarURL({
                        format: "jpg"
                    })
                );

                const background = await Canvas.loadImage("./assets/image/simpcard.png");

                const canvas = Canvas.createCanvas(1280, 720);
                const ctx = canvas.getContext(`2d`);

                ctx.drawImage(background, 0, 0, 1280, 720);
                ctx.drawImage(avatar, 100, 75, 320, 360)
                ctx.font = '45px "Amaranth"'
                ctx.fillText(`${member.user.username}`, 230, 505)
                ctx.fillText(`${message.createdAt.toLocaleDateString()}`, 75, 620);

                ctx.font = '45px "Amaranth"'
                ctx.textAlign = "left"
                ctx.fillText(`${data.Lowest}%`, 244, 660)
                ctx.fillText(`${data.Highest}%`, 302, 703);

                const attachment = new MessageAttachment(canvas.toBuffer(), "simpcard.jpg");

                message.channel.send({
                    content: "If your username contains any non-alphabetical characters, it won't show the username.",
                    files: [attachment]
                });
            });

        } else return message.reply("Invalid query.");
    },
};