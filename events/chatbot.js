const Schema = require('../models/server/chatbot-channel');
const client = require('../index');
const fetch = require('axios');

client.on("messageCreate", async(message) => {
  if(!message.guild || message.author.bot) return;
  Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
    if(!data) return;
    if(message.channel.id !== data.Channel) return;
    if(client.config.api.chatbot === "false") {
      fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
        .then(({ data }) => message.channel.send(data.response));

    } else if (client.config.api.chatbot === "easy-discord-chatbot") {
      fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${message.content}&botname=${client.user.username}`)
        .then(({ data }) => message.channel.send(data.response));

    } else {
      fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}&key=${client.config.api.chatbot}`)
      .then(({ data }) => message.channel.send(data.response));

    }
  });
});