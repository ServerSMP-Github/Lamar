const {
   Message,
   Client,
   MessageActionRow,
   MessageButton,
   MessageEmbed,
   MessageAttachment
} = require("discord.js");
const axios = require('axios');

module.exports = {
   name: 'namemc',
   usage: '[ mc username ]',
   description: "Gets name history of a Minecraft user from the Mojang API.",
   /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
   run: async (client, message, args) => {

      function joinNames(playerNameHistory) {
         let allNames = '';
         for (let i = 0; i < playerNameHistory.length; i++) {
            if (i + 1 !== playerNameHistory.length) {
               allNames += playerNameHistory[i].name + ', ';
            } else {
               allNames += playerNameHistory[i].name;
            }
         }
         return allNames;
      }

      if (args.length > 1 || !/^[a-zA-Z0-9_]{3,16}$/.test(args[0])) return message.channel.send('Please only provide a valid username after the command.');

      if (args.length == 0) return message.channel.send("Not enough arguments! Please provide a username.");

      try {
         const uuid = (await axios.get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)).data.id;

         const names = (await axios.get(`https://api.mojang.com/user/profiles/${uuid}/names`)).data;
   
         const nameHistory = new MessageEmbed()
            .setTitle(`${args[0]}'s Name History`)
            .setThumbnail('https://visage.surgeplay.com/face/' + uuid)
            .setURL(`https://namemc.com/${args[0]}`)
            .setColor('#dee8eb');
   
         nameHistory.addField(
            `${args[0]} has had ${names.length} name change/s.`,
            `**${args[0]}'s** name history includes: ${joinNames(names)}`
         );
   
         return message.channel.send({
            embeds: [nameHistory]
         });
      } catch (error) {
         message.channel.send("An error occurred when executing this command. Invalid username?");
      }

   },
};