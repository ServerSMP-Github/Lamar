const schema = require('../models/server/autorole');
const client = require('../index');

client.on("guildMemberAdd", async(member) => {
    if (member.user.bot) return;
    schema.findOne({ Guild: member.guild.id }, async(err, data) => {
        if (!data) return;
        const role = member.guild.roles.cache.get(data.Role);
        member.roles.add(role.id);
    });
})
