const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { nearestColor } = require("../../assets/api/color");
const { isImageUrl } = require("../../assets/api/url");
const { Message, Client } = require("discord.js");
const twemoji = require('twemoji');

module.exports = {
    name: 'emoji-img',
    usage: '[ emoji | img ]',
    description: 'Turn emoji/images into emojis',
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

        const getUrl = async(client, args) => {
            const emojiName = (args[0]?.split(":")[2])?.split(">")[0];
            const emoji = message.guild.emojis.resolve(emojiName);

            if (emoji) return emoji.url;
            else if (args[0].startsWith("https://") || args[0].startsWith("http://") && args[0].endsWith(".png") || args[0].endsWith(".jpg")) {
                if (!await isImageUrl(args[0])) return;

                return args[0];
            } else {
                const text = await twemoji.parse(args[0]);
                if (text.startsWith("<img")) {
                    const pos = text.indexOf("src");
                    return text.substring(pos + 5, text.length - 3);
                } else return null;
            }
        }

        const processImage = async (url, palette) => {
            const canvas = createCanvas(30, 30);
            const ctx = canvas.getContext('2d');

            const image = await loadImage(url);
            ctx.drawImage(image, 0, 0, 30, 30);

            const imageData = ctx.getImageData(0, 0, 30, 30);

            const characters = [];
            for (let i = 0; i < imageData.data.length; i += 4) {
                const color = {
                    R: imageData.data[i],
                    G: imageData.data[i + 1],
                    B: imageData.data[i + 2],
                };
                const nearest = nearestColor(color, palette);
                characters.push(nearest);
            }

            return characters;
        }

        try {
            const url = await getUrl(client, args);
            if (!url) return message.reply("Error. Only works with custom emojis from this guild / default emojis / png or jpg urls.");

            message.channel.send("Generating..");

            const rgbValue = await processImage(url, emojiRgb);

            const results = [];
            for (let i = 0; i < rgbValue.length; i++) results.push(rgbValue[i].E);

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
        } catch (err) {
            console.error(err);
            message.reply("Error. Could not process image.");
        }
    },
};