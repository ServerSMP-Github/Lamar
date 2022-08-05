const Schema = require('../models/server/chatbot-channel');
const Chat = require("easy-discord-chatbot");
const client = require('../index');
const fetch = require('axios');

client.on("messageCreate", async(message) => {
  if(!message.guild || message.author.bot) return;
  Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
    if(!data) return;
    if(message.channel.id !== data.Channel) return;
    if(client.config.api.chatbot === "false") {
      fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
      .then(data => {
        message.channel.send(data.data.response);
      });

    } else if (client.config.api.chatbot === "easy-discord-chatbot") {
      const chat = new Chat({ name: client.user.username });
      message.channel.send(await chat.chat(message.content));

    } else {
      fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}&key=${client.config.api.chatbot}`)
      .then(data => {
        message.channel.send(data.data.response);
      });

    }
  });
});