const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
   name: "avatar",
   aliases: ['av'],
   usage: '[none | id | mention] ',
   description: "Retrieve the avatar of a user.",
   /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
   run: async (client, message, args) => {

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      const user = args[0]?.toLowerCase() === "random" ? client.users.cache.random() : member.user;

      message.channel.send({
         embeds: [
            new EmbedBuilder()
            .setColor("Random")
            .setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
            .setAuthor({ name: user.username })
         ]
      });

   },
};