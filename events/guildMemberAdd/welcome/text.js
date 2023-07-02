module.exports = {
    name: "text",
    run: async (data, client, channel, member) => {
        return channel.send({ content: `Welcome **${member.user.username}** to **${member.guild.name}**!` });
    }
}