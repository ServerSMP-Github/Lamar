const {
    Client,
    Message,
    EmbedBuilder
} = require("discord.js");
const block = "⬛";
const heart = ":red_square:";

module.exports = {
    name: "ship",
    description: "Find out how much 2 people love each other!",
    usage: "@user @user",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user1 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const user2 = message.mentions.members.last() || message.guild.members.cache.get(args[1]);

        if (!user1 || !user2) return message.reply("Please specify 2 members.") 

        try {
            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor('dd2e44')
                    .setTitle('Shipping...')
                    .setDescription(`Shipped ****${user1.user.tag}**** and ****${user2.user.tag}****!`)
                    .setImage(`https://api.popcat.xyz/ship?user1=${user1.user.displayAvatarURL({ dynamic: false, format: "png" })}&user2=${user2.user.displayAvatarURL({ dynamic: false, format: "png" })}`)
                    .addField(`**Ship Meter**`, ship())
                ]
            })
        } catch (error) {
            await message.reply({
                content: "An Error Occured"
            })
        }

        function ship() {
            const hearts = Math.floor(Math.random() * 110) + 0;
            const hearte = (hearts / 10)

            const str = `${heart.repeat(hearte)}${block.repeat(11 - hearte)} ${hearts}%`;
            return str;
        }
    },
};