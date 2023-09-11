const { Client, Message, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const progress = require("../../assets/api/progressbar");
const { getRandom } = require("../../assets/api/crypto");

module.exports = {
    name: "ship",
    description: "Find out how much 2 people love each other!",
    usage: "[ @user ] [ @user ]",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user1 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const user2 = message.mentions.members.last() || message.guild.members.cache.get(args[1]);

        if (!user1 || !user2) return message.reply("Please specify 2 members.") ;

        const percent = Math.floor(getRandom() * 101);

        const canvas = createCanvas(384, 128);
        const ctx = canvas.getContext('2d');

        const avatar1 = await loadImage(user1.user.displayAvatarURL({ dynamic: false, format: "png" }));
        ctx.drawImage(avatar1, 0, 0, 128, 128);

        const heart = await loadImage("./assets/image/roleplay/heart.png");
        ctx.drawImage(heart, 128, 0, 128, 128);

        const avatar2 = await loadImage(user2.user.displayAvatarURL({ dynamic: false, format: "png" }));
        ctx.drawImage(avatar2, 256, 0, 128, 128);

        try {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor('#dd2e44')
                    .setTitle('Shipping...')
                    .setDescription(`Shipped ****${user1.user.username}**** and ****${user2.user.username}****!`)
                    .setImage("attachment://ship.png")
                    .addFields([
                        { name: "**Ship Meter**", value: `${progress(client, percent, 100, 10, "⬛", "🟥")} ${percent}%` }
                    ])
                ],
                files: [
                    new AttachmentBuilder(canvas.toBuffer("image/png"), { name: 'ship.png' })
                ]
            });
        } catch (error) {
            console.log(error)
            return message.reply({ content: "An error occurred" });
        }
    },
};