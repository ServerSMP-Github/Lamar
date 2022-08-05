const { Client, Message, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "dog",
    description: "A random image of a dog.",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let dog = null;

        dog = (await axios.get("https://random.dog/woof.json")).data;
        while (dog.url.endsWith(".webm") || dog.url.endsWith(".mp4")) dog = (await axios.get("https://random.dog/woof.json")).data;

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Dog :dog:")
                    .setFooter({ text: "A random dog from `https://random.dog/`" })
                    .setImage(String(dog.url))
            ]
        });
    },
};