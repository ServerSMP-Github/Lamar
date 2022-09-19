const { antijoin } = require('../../client/collection');
const client = require("../../index");

module.exports = async(member) => {
    const getCollection = antijoin.get(member.guild.id);

    if(!getCollection) return;

    if(!getCollection.includes(member.user)) getCollection.push(member.user);

    member.kick({ reason: "Antijoin was enabled" });
}