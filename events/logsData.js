const Schema = require('../models/logs/logsData');
const client = require("../index");
const dayjs = require("dayjs");

const format = dayjs().format('YYYY-MM');

client.on("channelCreate", async (channel) => {
    const data = await Schema.findOne({
        Guild: channel.guild.id
    }).exec();
    if (!data) return;
    data.ChannelCreate.push(`${format}`);
    data.save();

    let arrayData = [];
    data.ChannelCreate.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.ChannelCreate = arrayData;
        data.save();
    });
});

client.on("channelDelete", async (channel) => {
    const data = await Schema.findOne({
        Guild: channel.guild.id
    }).exec();
    if (!data) return;
    data.ChannelDelete.push(`${format}`);
    data.save();

    let arrayData = [];
    data.ChannelDelete.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.ChannelDelete = arrayData;
        data.save();
    });
});

client.on("channelPinsUpdate", async (channel, time) => {
    const data = await Schema.findOne({
        Guild: channel.guild.id
    }).exec();
    if (!data) return;
    data.ChannelPinUpdate.push(`${format}`);
    data.save();

    let arrayData = [];
    data.ChannelPinUpdate.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.ChannelPinUpdate = arrayData;
        data.save();
    });
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    const data = await Schema.findOne({
        Guild: oldChannel.guild.id
    }).exec();
    if (!data) return;
    data.ChannelUpdate.push(`${format}`);
    data.save();

    let arrayData = [];
    data.ChannelUpdate.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.ChannelUpdate = arrayData;
        data.save();
    });
});

client.on("emojiCreate", async (emoji) => {
    const data = await Schema.findOne({
        Guild: emoji.guild.id
    }).exec();
    if (!data) return;
    data.EmojiCreate.push(`${format}`);
    data.save();

    let arrayData = [];
    data.EmojiCreate.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.EmojiCreate = arrayData;
        data.save();
    });
});

client.on("emojiDelete", async (emoji) => {
    const data = await Schema.findOne({
        Guild: emoji.guild.id
    }).exec();
    if (!data) return;
    data.EmojiDelete.push(`${format}`);
    data.save();

    let arrayData = [];
    data.EmojiDelete.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.EmojiDelete = arrayData;
        data.save();
    });
});

client.on("emojiUpdate", async (olEemoji, newEmoji) => {
    const data = await Schema.findOne({
        Guild: olEemoji.guild.id
    }).exec();
    if (!data) return;
    data.EmojiUpdate.push(`${format}`);
    data.save();

    let arrayData = [];
    data.EmojiUpdate.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.EmojiUpdate = arrayData;
        data.save();
    });
});

client.on("guildBanAdd", async (ban) => {
    const data = await Schema.findOne({
        Guild: ban.guild.id
    }).exec();
    if (!data) return;
    data.BanAdd.push(`${format}`);
    data.save();

    let arrayData = [];
    data.BanAdd.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.BanAdd = arrayData;
        data.save();
    });
});

client.on("guildBanRemove", async (ban) => {
    const data = await Schema.findOne({
        Guild: ban.guild.id
    }).exec();
    if (!data) return;
    data.BanRemove.push(`${format}`);
    data.save();

    let arrayData = [];
    data.BanRemove.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.BanRemove = arrayData;
        data.save();
    });
});

client.on("guildMemberAdd", async (member) => {
    const data = await Schema.findOne({
        Guild: member.guild.id
    }).exec();
    if (!data) return;
    data.MemberAdd.push(`${format}`);
    data.save();

    let arrayData = [];
    data.MemberAdd.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.MemberAdd = arrayData;
        data.save();
    });
});

client.on("guildMemberRemove", async (member) => {
    const data = await Schema.findOne({
        Guild: member.guild.id
    }).exec();
    if (!data) return;
    data.MemberRemove.push(`${format}`);
    data.save();

    let arrayData = [];
    data.MemberRemove.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.MemberRemove = arrayData;
        data.save();
    });
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const data = await Schema.findOne({
        Guild: oldMember.guild.id
    }).exec();
    if (!data) return;
    data.MemberUpdate.push(`${format}`);
    data.save();

    let arrayData = [];
    data.MemberUpdate.forEach(channelData => {
        const parsedYear = channelData.split("-").slice(0, 1);

        const format = dayjs().format('YYYY');

        if(parsedYear === format) {
            arrayData.push(channelData);
        } else return;
        data.MemberUpdate = arrayData;
        data.save();
    });
});

client.on("messageDelete", async (message) => {
    if(!message.guild) return;
    const data = await Schema.findOne({
        Guild: message.guild.id
    }).exec();
    if (!data) return;
    data.MessagesDelete = Number(data.MessagesDelete) + 1;
    data.save();
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(!oldMessage.guild) return;
    const data = await Schema.findOne({
        Guild: oldMessage.guild.id
    }).exec();
    if (!data) return;
    data.MessagesEdit = Number(data.MessagesDelete) + 1;
    data.save();
});

client.on("messageUpdate", async (message) => {
    if (!message.guild) return;
    Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
        if(data) {
            data.Messages = Number(data.Messages) + 1;
            data.save();
        }
    });
});
