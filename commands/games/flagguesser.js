const { getFileList } = require("../../assets/api/file");
const { Message, Client } = require('discord.js');

module.exports = {
    name: 'flagguesser',
    description: "Guess the flag and become #1.",
    aliases : ['fg'],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const query = args[0]?.toLowerCase();

        const argFiles = await getFileList(`${process.cwd()}/commands/games/flagGuesser`, { type: ".js", recursively: false });
        argFiles.map((value) => {
            const file = require(value);

            query === file.name ? file.run(client, message, args) : !file.name && !query ? file.run(client, message, args) : null
        });
    }
}