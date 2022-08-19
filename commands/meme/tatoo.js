const { Message, Client, AttachmentBuilder } = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = {
    name: 'tatoo',
    usage: '[@user (or not)]',
    description : "You/friend are the best tatoo.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) user = message.member;
        let avatar = user.user.displayAvatarURL({ dynamic: false, format: 'png' });
        let img = await new DIG.Tatoo().getImage(avatar);
        let attach = new AttachmentBuilder(img, { name: "tatoo.png" });
        message.channel.send({ files: [attach] });
    },
};