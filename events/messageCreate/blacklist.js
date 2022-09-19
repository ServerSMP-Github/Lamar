const { blacklistedwords } = require('../../client/collection');
const client = require("../../index");

module.exports = async(message) => {
    if(!message.guild || message.author.id === client.user.id) return;

    const splittedMsgs = message.content.split(' ');
    let deleting = false;

    await Promise.all(
        splittedMsgs.map((content) => {
            if (blacklistedwords.get(message.guild.id)?.includes(content.toLowerCase())) deleting = true;
        })
    )

    if(deleting) return message.delete();
}