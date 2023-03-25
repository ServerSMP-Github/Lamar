const client = require("../../index");

const { getFileList } = require("../../assets/api/file");

const Schema = require('../../models/logs/welcome');

module.exports = async(member) => {
    const data = await Schema.findOne({ Guild: member.guild.id });
    if (!data) return;

    const type = data.Type?.toLowerCase();

    const channel = member.guild.channels.cache.get(data.Channel);

    const welcomeFiles = await getFileList(`${process.cwd()}/events/guildMemberAdd/welcome`, { type: ".js", recursively: false });
    return welcomeFiles.map((value) => {
        const file = require(value);

        type === file.name ? file.run(data, client, channel, member) : !file.name && !type ? channel.send({ content: `Welcome **${member.user.tag}** to **${member.guild.name}**! ||An error has occurred||` }) : null
    });
}