module.exports = {
    name: "text",
    run: async (data, client, channel, member) => {
        return channel.send({ content: `Goodbye **${member.user.username}**!` });
    }
}