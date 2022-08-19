const { Message, Client, PermissionsBitField } = require('discord.js');
const simplydjs = require('simply-djs');

module.exports = {
    name: 'embed-create',
    description : "Create embeds!",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        simplydjs.embedCreate(message)
    }
}
