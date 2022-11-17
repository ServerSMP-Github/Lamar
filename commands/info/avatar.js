const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
   name: "avatar",
   aliases: ['av'],
   usage: '[none | id | mention] ',
   description: "Returns users avatar",
   /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
   run: async (client, message, args) => {

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

      if (args[0]?.toLowerCase() === "random") {
         const user = client.users.cache.random();
         return message.channel.send({
            embeds: [
               new EmbedBuilder()
               .setColor("Random")
               .setImage(user.displayAvatarURL({
                  size: 4096,
                  dynamic: true
               }))
               .setFooter({ text: `${user.tag}'s avatar` })
            ]
         })
      }

      message.channel.send({
         embeds: [
            new EmbedBuilder()
            .setColor("Random")
            .setImage(member.user.displayAvatarURL({
               size: 4096,
               dynamic: true
            }))
            .setAuthor({
               name: member.user.username
            })
         ]
      });

   },
};