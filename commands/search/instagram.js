const {
    Message,
    Client,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageAttachment
} = require('discord.js');
const {
    createCanvas,
    loadImage
} = require('@napi-rs/canvas');
const axios = require('axios');

module.exports = {
    name: 'instagram',
    description: "Get info from instagram.",
    usage: '[ instagram username ]',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        // Get username
        const query = args[0];

        if (!query) return message.reply("Please specify a username!");

        // Get data
        const user = (await axios.get(`https://api.popcat.xyz/instagram?user=${query}`)).data;

        if (user.error) return message.reply("User not found!");

        // Creating
        const canvas = createCanvas(664, 233)
        const ctx = canvas.getContext('2d')

        // User picture
        const userdisplay = await loadImage(user.profile_pic)
        ctx.drawImage(userdisplay, 32, 32, 150, 150)

        // Background
        const background = await loadImage('./assets/image/instagram.png')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        // name
        ctx.font = "27px Arial";
        ctx.rotate(0);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(user.username, 215, 70);

        // bio
        ctx.font = "13px Arial";
        ctx.rotate(0);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`Bio: ${user.biography.slice(0, 49)}`, 215, 110);

        ctx.font = "13px Arial";
        ctx.rotate(0);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(user.biography.slice(49), 215, 125);

        // Followers
        ctx.font = "bold 13px Arial";
        ctx.rotate(0);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`${user.followers} Followers`, 215, 165);

        // Following
        ctx.font = "bold 13px Arial";
        ctx.rotate(0);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`${user.following} Following`, 350, 165);

        // Posts
        ctx.font = "bold 13px Arial";
        ctx.rotate(0);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`${user.posts} Posts`, 490, 165);

        // Sending
        const attachment = new MessageAttachment(canvas.toBuffer(), 'insta.png');
        message.channel.send({
            files: [attachment]
        })

    }
}
