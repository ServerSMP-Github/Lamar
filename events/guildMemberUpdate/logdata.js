const { YYYY, YYYY_MM } = require("../../assets/api/time");
const Schema = require('../../models/logs/logsData');
const client = require("../../index");

const formatData = YYYY_MM(Date.now());

module.exports = async(oldMember, newMember) => {
    const data = await Schema.findOne({ Guild: oldMember.guild.id }).exec();
    if (!data) return;

    data.MemberUpdate.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.MemberUpdate.length; index++) {
        const element = data.MemberUpdate[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.MemberUpdate = arrayData;
        await data.save();
    }
}