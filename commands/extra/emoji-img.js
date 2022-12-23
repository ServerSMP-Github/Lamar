const { nearestColor } = require("../../assets/api/color");
const { Message, Client } = require("discord.js");
const twemoji = require('twemoji');
const Jimp = require('jimp');

module.exports = {
    name: 'emoji-img',
    usage: '[ emoji ]',
    description: 'Turn emoji into an image with emojis',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const emojiRgb = [{
                R: 255,
                G: 255,
                B: 255,
                E: ":white_large_square:"
            },
            {
                R: 0,
                G: 0,
                B: 0,
                E: ":black_large_square:"
            },
            {
                R: 255,
                G: 0,
                B: 0,
                E: ":red_circle:"
            },
            {
                R: 0,
                G: 255,
                B: 0,
                E: ":green_heart:"
            },
            {
                R: 0,
                G: 0,
                B: 255,
                E: ":blue_heart:"
            },
            {
                R: 253,
                G: 203,
                B: 88,
                E: ":yellow_heart:"
            },
            {
                R: 154,
                G: 78,
                B: 28,
                E: ":briefcase:"
            },
            {
                R: 102,
                G: 117,
                B: 127,
                E: ":new_moon:"
            },
            {
                R: 146,
                G: 102,
                B: 204,
                E: ":star_of_david:"
            },
            {
                R: 89,
                G: 142,
                B: 60,
                E: ":green_apple:"
            },
            {
                R: 92,
                G: 172,
                B: 235,
                E: ":blue_circle:"
            }
        ];

        if (args.length < 1) return message.reply(":warning: Need one argument. A custom emoji or image url.");

        const emojiName = args[0].split(":")[1];

        const emoji = client.emojis.resolve(emojiName);
        let url = "";

        if (!emoji) {
            if (args[0].startsWith("https://") || args[0].startsWith("http://") && args[0].endsWith(".png") || args[0].endsWith(".jpg")) url = args[0];
            else {
                let text = twemoji.parse(args[0]);
                if (!text.startsWith("<img")) return message.reply("Error. Only works with custom emojis from this guild / default emojis / png or jpg urls.");
                const pos = text.indexOf("src");
                text = text.substring(pos + 5);
                text = text.substring(0, text.length - 3);
                url = text;
            }
        }

        if (url == "") {
            url = emoji.url;
            message.channel.send(url);
        } else message.channel.send("Generating..");

        const palette = [];
        for (let i = 0; i < emojiRgb.length; i++) {
            palette.push({
                R: emojiRgb[i].R,
                G: emojiRgb[i].G,
                B: emojiRgb[i].B,
            });
        }

        const transColors = [];
        const imgName = "temp/images/emoji.png";
        Jimp.read(url, (err, img) => {
            if (err) return message.reply("Error. Could not read image.");

            img
                .resize(30, 30)
                .write(imgName, () => {
                    Jimp.read(imgName, (err, img) => {
                        if (err) throw err;

                        for (let i = 0; i < 30; i++) {
                            for (let j = 0; j < 30; j++) {
                                const hex = img.getPixelColor(j, i);
                                const rgb = Jimp.intToRGBA(hex);

                                transColors.push(nearestColor({
                                    R: rgb.r,
                                    G: rgb.g,
                                    B: rgb.b
                                }, palette));
                            }
                        }

                        const results = [];
                        for (let i = 0; i < transColors.length; i++) {
                            const e2 = Object.values(transColors[i]);

                            for (let j = 0; j < emojiRgb.length; j++) {
                                const e1 = Object.values(emojiRgb[j]).slice(0, -1);
                                let e3 = false;

                                if (e1[0] == e2[0] && e1[1] == e2[1] && e1[2] == e2[2]) e3 = true;
                                if (e3) {
                                    results.push(emojiRgb[j].E);
                                    break;
                                }
                            }
                        }

                        for (let mul = 0; mul < 10; mul++) {
                            let string1 = "";
                            let string2 = "";
                            let string3 = "";

                            const base = 90 * mul;
                            for (var i = 0; i < 30; i++) {
                                string1 += results[i + base];
                                string2 += results[i + 30 + base];
                                string3 += results[i + 60 + base];
                            }

                            message.channel.send(`${string1}\n${string2}\n${string3}`);
                        }
                    });
                });
        });
    },
};