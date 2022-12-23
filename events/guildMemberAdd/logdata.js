const { YYYY, YYYY_MM } = require("../../assets/api/time");
const Schema = require('../../models/logs/logsData');
const client = require("../../index");

const formatData = YYYY_MM(Date.now());

module.exports = async(member) => {
    const data = await Schema.findOne({ Guild: member.guild.id }).exec();
    if (!data) return;

    data.MemberAdd.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.MemberAdd.length; index++) {
        const element = data.MemberAdd[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.MemberAdd = arrayData;
        await data.save();
    }
}