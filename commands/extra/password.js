const { generatePassword } = require('../../assets/api/crypto');
const { Message, Client } = require('discord.js');

module.exports = {
    name: 'password',
    category : 'extra',
    usage: '[1-100]',
    description : "Generate random password from 1 - 100 and sends it in DMs.",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const number = Number(args[0])
        if(!number) return message.channel.send(String('Enter a password length equal to or less than 100 please :)'))
        if(number > 100 || number < 1) return message.channel.send(String('The password length is not a valid number :), enter a number between 1 to 100'))

        message.member.send(`||\`${generatePassword(number)}\`||`);
        message.reply('A random password has been sent to your DMs');
    }
}
