const { Message, Client, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
  name: 'osu',
  description: "Get's info on a osu user!",
  usage: "[ osu username ]",

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!client.config.api.osu) return message.reply("OSU command is off.");

    const username = args[0];
    if (!username) return message.reply("Please specify a username!");

    try {
      const user = (await (await fetch(`https://osu.ppy.sh/api/get_user?k=${client.config.api.osu}&u=${username}`)).json())[0];

      const canvas = createCanvas(960, 160);
      const ctx = canvas.getContext('2d');

      // Avatar
      const userdisplay = await loadImage(`https://a.ppy.sh/${user.user_id}`)
      ctx.drawImage(userdisplay, 15, 15, 128, 128)

      // Background
      const background = await loadImage('./assets/image/osu.png')
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

      // Username and rank
      ctx.font = 'italic 15px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(`${user.username} #${user.pp_rank}`, 155, 30)

      // Country and rank
      ctx.font = 'italic 15px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(`${user.country} #${user.pp_country_rank}`, 155, 55)

      // pp
      ctx.font = 'italic 15px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(user.pp_raw)}pp`, 633, 30)

      // Accuracy
      ctx.font = 'italic 13px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(user.accuracy)}% acc`, 628, 55)

      // Rank ssh
      ctx.font = '13px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${user.count_rank_ssh}`, 685, 60)

      // Rank ss
      ctx.font = '13px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${user.count_rank_ss}`, 730, 60)

      // Rank sh
      ctx.font = '13px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${user.count_rank_sh}`, 772, 60)

      // Rank s
      ctx.font = '13px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${user.count_rank_s}`, 815, 60)

      // Rank a
      ctx.font = '13px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${user.count_rank_a}`, 860, 60)

      // Level
      ctx.font = '15px Arial'
      ctx.rotate(0)
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(user.level)}`, 907, 49)

      message.channel.send({
        files: [
          new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'osu.png' })
        ]
      });
    } catch (err) {
      message.reply("User does not exist!");
    }
  }
}