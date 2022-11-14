const { ContextMenuInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
    name: 'serversmp',
    description: 'ServerSMP Info',
    run: async(client, interaction, args) => {
      
      interaction.followUp({content: "ServerSMP Info"});
      
    }
}
  
