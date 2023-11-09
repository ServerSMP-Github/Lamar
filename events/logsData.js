const { YYYY, YYYY_MM } = require("../assets/api/time");
const Schema = require('../models/logs/logsData');
const { Events } = require("discord.js");
const client = require("../index");

const formatData = YYYY_MM(Date.now());

client.on(Events.ChannelCreate, async (channel) => {
    const data = await Schema.findOne({ Guild: channel.guild.id }).exec();
    if (!data) return;

    data.ChannelCreate.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.ChannelCreate.length; index++) {
        const element = data.ChannelCreate[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.ChannelCreate = arrayData;
        await data.save();
    }
});

client.on(Events.ChannelDelete, async (channel) => {
    const data = await Schema.findOne({ Guild: channel.guild.id }).exec();
    if (!data) return;

    data.ChannelDelete.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.ChannelDelete.length; index++) {
        const element = data.ChannelDelete[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.ChannelDelete = arrayData;
        await data.save();
    }
});

client.on(Events.ChannelPinsUpdate, async (channel, time) => {
    const data = await Schema.findOne({ Guild: channel.guild.id }).exec();
    if (!data) return;

    data.ChannelPinUpdate.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.ChannelPinUpdate.length; index++) {
        const element = data.ChannelPinUpdate[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.ChannelPinUpdate = arrayData;
        await data.save();
    }
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    const data = await Schema.findOne({ Guild: oldChannel.guild.id }).exec();
    if (!data) return;

    data.ChannelUpdate.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.ChannelUpdate.length; index++) {
        const element = data.ChannelUpdate[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.ChannelUpdate = arrayData;
        await data.save();
    }
});

client.on(Events.GuildEmojiCreate, async (emoji) => {
    const data = await Schema.findOne({ Guild: emoji.guild.id }).exec();
    if (!data) return;

    data.EmojiCreate.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.EmojiCreate.length; index++) {
        const element = data.EmojiCreate[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.EmojiCreate = arrayData;
        await data.save();
    }
});

client.on(Events.GuildEmojiDelete, async (emoji) => {
    const data = await Schema.findOne({ Guild: emoji.guild.id }).exec();
    if (!data) return;

    data.EmojiDelete.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.EmojiDelete.length; index++) {
        const element = data.EmojiDelete[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.EmojiDelete = arrayData;
        await data.save();
    }
});

client.on(Events.GuildEmojiUpdate, async (olEemoji, newEmoji) => {
    const data = await Schema.findOne({ Guild: olEemoji.guild.id }).exec();
    if (!data) return;

    data.EmojiUpdate.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.EmojiUpdate.length; index++) {
        const element = data.EmojiUpdate[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.EmojiUpdate = arrayData;
        await data.save();
    }
});

client.on(Events.GuildBanAdd, async (ban) => {
    const data = await Schema.findOne({ Guild: ban.guild.id }).exec();
    if (!data) return;

    data.BanAdd.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.BanAdd.length; index++) {
        const element = data.BanAdd[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.BanAdd = arrayData;
        await data.save();
    }
});

client.on(Events.GuildBanRemove, async (ban) => {
    const data = await Schema.findOne({ Guild: ban.guild.id }).exec();
    if (!data) return;

    data.BanRemove.push(formatData);
    await data.save();

    let arrayData = [];

    for (let index = 0; index < data.BanRemove.length; index++) {
        const element = data.BanRemove[index];
        
        const parsedYear = element.split("-").slice(0, 1);

        const format = String(YYYY(Date.now()));

        if (parsedYear === format) arrayData.push(element);
        else return;

        data.BanRemove = arrayData;
        await data.save();
    }
});

client.on(Events.MessageDelete, async (message) => {
    if(!message.guild) return;

    const data = await Schema.findOne({ Guild: message.guild.id }).exec();
    if (!data) return;

    data.MessagesDelete = Number(data.MessagesDelete) + 1;
    await data.save();
});

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if(!oldMessage.guild) return;

    const data = await Schema.findOne({ Guild: oldMessage.guild.id }).exec();
    if (!data) return;

    data.MessagesEdit = Number(data.MessagesDelete) + 1;
    await data.save();
});