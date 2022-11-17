const client = require("../../index");

const Schema = require('../../models/logs/welcome');

const { Swiftcord } = require("swiftcord");
const { AttachmentBuilder } = require('discord.js');
const { drawCard } = require('discord-welcome-card');
const { createCanvas, loadImage, registerFont } = require('canvas');
// const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas');

const cord = new Swiftcord();

const jimp = require("jimp");

let attachment = null;
let text = null

module.exports = async(member) => {
    const welcomeData = await Schema.findOne({ Guild: member.guild.id });

    if (!welcomeData) return;

    const welcomeType = welcomeData.Type?.toLowerCase();

    const channel = member.guild.channels.cache.get(welcomeData.Channel);

    if (welcomeType === "popcat") {

        registerFont('assets/image/welcome/popcat/font.ttf', { family: 'Fredoka One' });

        const canvas = createCanvas(1024, 500);
        const ctx = canvas.getContext('2d');

        const background = await loadImage(`assets/image/welcome/popcat/background.png`);
        ctx.drawImage(background, 0, 0, 1024, 500);

        ctx.font = '65px Fredoka One';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(member.user.username, 512, 355);

        ctx.font = '40px Fredoka One';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`Welcome To ${member.guild.name}`, 512, 410);

        ctx.font = '30px Fredoka One';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`Member ${member.guild.memberCount}`, 512, 455);

        ctx.beginPath();
        ctx.arc(515, 175, 100, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.lineWidth = 16;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(515, 175, 100, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(515, 175, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", size: 2048 }));
        ctx.drawImage(avatar, 415, 75, 200, 200);

        attachment = new AttachmentBuilder(canvas.toBuffer(), { name: `welcome-${member.id}.png` });

    } else if (welcomeType === "discord-welcome-card") {
        attachment = new AttachmentBuilder(
            await drawCard({
                theme: welcomeData.Theme,
                text: {
                    title: welcomeData.Title,
                    text: member.user.tag,
                    subtitle: `MemberCount: ${member.guild.memberCount}`
                },
                avatar: {
                    image: member.user.avatarURL({ format: 'png' })
                },
                blur: welcomeData.Blur,
                border: welcomeData.Border,
                rounded: welcomeData.Rounded                
            }),
            { name: `welcome-${member.id}.png` }
        )

    } else if (welcomeType === "ultrax") {

        let fontName = null;
        if (welcomeData.FontPath?.toLowerCase() !== "San Serif") {
            registerFont(welcomeData.FontPath, { family: welcomeData.FontName });
            fontName = welcomeData.FontName;
        }

        const canvas = createCanvas(1024, 500);
        const ctx = canvas.getContext('2d');

        let backgroundLink = welcomeData.Background;
        if (welcomeData.Background?.toLowerCase() === "default") backgroundLink = "assets/image/welcome/popcat/background.png";

        const background = await loadImage(backgroundLink);
        ctx.drawImage(background, 0, 0, 1024, 500);

        let color = welcomeData.Color;
        if (welcomeData.Color?.toLowerCase() === "default") color = "#ffffff";

        ctx.font = `65px ${fontName}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(member.user.username, 512, 355);

        ctx.font = `40px ${fontName}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(`Welcome To ${member.guild.name}`, 512, 410);

        ctx.font = `30px ${fontName}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(`Member ${member.guild.memberCount}`, 512, 455);

        ctx.beginPath();
        ctx.arc(515, 175, 100, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.lineWidth = 16;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(515, 175, 100, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 15;
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(515, 175, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", size: 2048 }));
        ctx.drawImage(avatar, 415, 75, 200, 200);

        attachment = new AttachmentBuilder(canvas.toBuffer(), { name: `welcome-${member.id}.png` });

    } else if (welcomeType === "swiftcord") {
        let background = welcomeData.Background;
        if (welcomeData.Background?.toLowerCase() === "default") background = "https://api.serversmp.xyz/upload/ocHlRwuhEI.png";

        const image = await cord.Welcome()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(member.guild.name)
            .setGuildIcon(member.guild.iconURL({ format: "png" }))
            .setAvatar(member.user.displayAvatarURL({ format: "png", size: 2048 }))
            .setBackground(background)
            .toAttachment();
        attachment = new AttachmentBuilder(image, { name: `welcome-${member.id}.png` })

    } else if (welcomeType === "discord-welcomer") {

        let backgroundLink = welcomeData.Background;
        if (backgroundLink?.toLowerCase() === "standart") backgroundLink = "assets/image/welcome/discord-welcomer/default.png";
        else if (backgroundLink?.toLowerCase() === "invisible") backgroundLink = "assets/image/welcome/discord-welcomer/invisible.png";

        const canvas = createCanvas(800, 270);
        const ctx = canvas.getContext("2d");

        const backgroundBlur = await jimp.read(backgroundLink);
        backgroundBlur.blur(5);

        const backgroundData = await backgroundBlur.getBufferAsync("image/png");
        const backgroundIMG = await loadImage(backgroundData);

        function round(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }

        function conner(r) {
            ctx.save()
            round(20, 20, canvas.width, canvas.height, r)
            round(-20, -20, canvas.width, canvas.height, r)
            round(-30, 30, canvas.width, canvas.height, r)
            ctx.clip()
            ctx.save()
            round(-30, -30, canvas.width, canvas.height, r)
            ctx.clip()
            ctx.save()
            round(-30, -30, canvas.width, canvas.height, r)
            ctx.clip()
            ctx.save()
            round(-30, -30, canvas.width, canvas.height, r)
            round(30, -30, canvas.width, canvas.height, r)
            ctx.clip()
            ctx.save()
            round(30, -30, canvas.width, canvas.height, r)
            round(30, 30, canvas.width, canvas.height, r)
            ctx.clip()
        }

        conner(20);
        ctx.drawImage(backgroundIMG, 30, 30, 739, 209);

        ctx.font = `bold 40px Life`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "start";
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.fillText("Welcome <3", 335, 113);

        ctx.font = `bold 35px Life`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "start";
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.fillText(`${member.user.username}`, 420, 170);

        ctx.beginPath();
        ctx.arc(140, 140, 85, 0, Math.PI * 2, false);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(140, 140, 85, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.shadowBlur = 10;

        const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", dynamic: true }));
        ctx.drawImage(avatar, 40, 40, 185, 185);

        attachment = new AttachmentBuilder(canvas.toBuffer(), { name: `welcome-${member.id}.png`});

    } else if (welcomeType === "text") text = `Welcome **${member.user.tag}** to **${member.guild.name}**!`;

    try {
        if (text !== null) return channel.send({ content: text });
        channel.send({ files: [attachment] });
    } catch (e) {
        channel.send({ content: `Welcome **${member.user.tag}** to **${member.guild.name}**! ||An error has occurred||` });
    }
}