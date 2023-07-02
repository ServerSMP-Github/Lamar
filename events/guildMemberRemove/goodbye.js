const client = require("../../index");

const { getFileList } = require("../../assets/api/file");

const Schema = require('../../models/logs/goodbye');

module.exports = async(member) => {
    const data = await Schema.findOne({ Guild: member.guild.id });
    if (!data) return;

    const type = data.Type?.toLowerCase();

    const channel = member.guild.channels.cache.get(data.Channel);

    const goodbyeFiles = await getFileList(`${process.cwd()}/events/guildMemberRemove/goodbye`, { type: ".js", recursively: false });
    return goodbyeFiles.map((value) => {
        const file = require(value);

        type === file.name ? file.run(data, client, channel, member) : !file.name && !type ? channel.send({ content: `Goodbye **${member.user.username}**! ||An error has occurred||` }) : null
    });
}