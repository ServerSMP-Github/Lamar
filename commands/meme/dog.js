const { Client, Message, EmbedBuilder } = require("discord.js");

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
        let dog = (await (await fetch("https://random.dog/woof.json")).json()).url;
        while (dog.url.endsWith(".webm") || dog.url.endsWith(".mp4")) dog = (await (await fetch("https://random.dog/woof.json")).json()).url;

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dog :dog:")
                .setFooter({ text: "A random dog from `https://random.dog/`" })
                .setImage(dog)
            ]
        });
    },
};