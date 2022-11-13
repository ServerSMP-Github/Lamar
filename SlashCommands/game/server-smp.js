const { ContextMenuInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
    name: 'serverSMP',
    description: 'ServerSMP Info',
    run: async(client, interaction, args) => {
      
      interaction.followUp({content: "Test"});
      
    }
}
  
