const client = require("../../index");

const Schema = require('../../models/logs/welcome');

const { AttachmentBuilder } = require('discord.js');
const { drawCard } = require('discord-welcome-card');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

let attachment = null;
let text = null

module.exports = async(member) => {
    const welcomeData = await Schema.findOne({ Guild: member.guild.id });

    if (!welcomeData) return;

    const welcomeType = welcomeData.Type?.toLowerCase();

    const channel = member.guild.channels.cache.get(welcomeData.Channel);

    if (welcomeType === "popcat") {

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

        attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: `welcome-${member.id}.png` });

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

        const fontName = welcomeData.FontName;

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

        attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: `welcome-${member.id}.png` });

    } else if (welcomeType === "swiftcord") {
        let background = welcomeData.Background;
        if (welcomeData.Background?.toLowerCase() === "default") background = path.join(__dirname, "..", "..", "assets", "image", "welcome", "popcat", "background.png");

        const username = member.user.username;
        const server = member.guild.name;

        const base = await loadImage(path.join(__dirname, "..", "..", "assets", "image", "welcome", "swiftcord", "base.png"));

        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext("2d");

        const bg = await loadImage(background);

        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.drawImage(base, 0, 0);

        ctx.fillStyle = "#ffffff";
        ctx.font = "22px Manrope bold";
        ctx.fillText(`- ${member.guild.memberCount}th member!`, 5, 435);

        ctx.globalAlpha = 1;
        ctx.font = "45px Manrope bold";
        ctx.textAlign = 'center';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(username, 134, 390);
        const tagLength = ctx.measureText(username).width;

        ctx.globalAlpha = 1;
        ctx.font = "45px Manrope bold";
        ctx.textAlign = 'center';
        ctx.fillStyle = "#7289DA";
        ctx.fillText(`#${member.user.discriminator}`, tagLength + 100, 390);

        ctx.globalAlpha = 1;
        ctx.font = "45px Manrope bold";
        ctx.textAlign = 'center';
        ctx.fillStyle = "#ffffff";
        const guildName = server.length > 13 ? server.substring(0, 10) + "..." : server;
        ctx.fillText(guildName, 799, 406);

        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#23272a";
        ctx.arc(874, 250, 80, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const guildIco = await loadImage(member.guild.iconURL({ format: "png" }));
        ctx.drawImage(guildIco, 794, 170, 160, 160);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#23272a";
        ctx.arc(180, 160, 110, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", size: 2048 }));
        ctx.drawImage(avatar, 45, 40, 270, 270);
        ctx.restore();

        attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: `welcome-${member.id}.png` });

    } else if (welcomeType === "discord-welcomer") {

        let backgroundLink = welcomeData.Background;
        if (backgroundLink?.toLowerCase() === "standart") backgroundLink = "assets/image/welcome/discord-welcomer/default.png";
        else if (backgroundLink?.toLowerCase() === "invisible") backgroundLink = "assets/image/welcome/discord-welcomer/invisible.png";

        const canvas = createCanvas(800, 270);
        const ctx = canvas.getContext("2d");

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

        const bg = await loadImage(backgroundLink);

        ctx.drawImage(bg, 30, 30, 739, 209);

        ctx.filter = 'blur(5px)';

        ctx.drawImage(bg, 30, 30, 739, 209);

        ctx.filter = 'none';

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

        attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: `welcome-${member.id}.png`});

    } else if (welcomeType === "text") text = `Welcome **${member.user.tag}** to **${member.guild.name}**!`;

    try {
        if (text !== null) return channel.send({ content: text });
        channel.send({ files: [attachment] });
    } catch (e) {
        channel.send({ content: `Welcome **${member.user.tag}** to **${member.guild.name}**! ||An error has occurred||` });
    }
}