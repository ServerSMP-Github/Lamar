const client = require('../index');

const Schema = require('../models/logs/welcome');

const { Swiftcord } = require("swiftcord");
const { AttachmentBuilder } = require('discord.js');
const { drawCard } = require('discord-welcome-card');
const { createCanvas, loadImage, registerFont } = require('canvas');

const cord = new Swiftcord();

const jimp = require("jimp");

let attachment = null;
let text = null
client.on("guildMemberAdd", async(member) => {
    Schema.findOne({ Guild: member.guild.id }, async(err, data) => {
        if (data) {
            const channel = member.guild.channels.cache.get(data.Channel);

            if (data.Type?.toLowerCase() === "popcat") {

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

                attachment = new AttachmentBuilder(canvas.toBuffer(), `welcome-${member.id}.png`);

            } else if (data.Type?.toLowerCase() === "discord-welcome-card") {
                attachment = new AttachmentBuilder(
                    await drawCard({
                        theme: data.Theme,
                        text: {
                            title: data.Title,
                            text: member.user.tag,
                            subtitle: `MemberCount: ${member.guild.memberCount}`
                        },
                        avatar: {
                            image: member.user.avatarURL({ format: 'png' })
                        },
                        blur: data.Blur,
                        border: data.Border,
                        rounded: data.Rounded                
                    }),
                    `welcome-${member.id}.png`
                )

            } else if (data.Type?.toLowerCase() === "ultrax") {

                let fontName = null;
                if (data.FontPath?.toLowerCase() !== "San Serif") {
                    registerFont(data.FontPath, { family: data.FontName });
                    fontName = data.FontName;
                }

                const canvas = createCanvas(1024, 500);
                const ctx = canvas.getContext('2d');

                let backgroundLink = data.Background;
                if (data.Background?.toLowerCase() === "default") backgroundLink = "assets/image/welcome/popcat/background.png";

                const background = await loadImage(backgroundLink);
                ctx.drawImage(background, 0, 0, 1024, 500);

                let color = data.Color;
                if (data.Color?.toLowerCase() === "default") color = "#ffffff";

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

                attachment = new AttachmentBuilder(canvas.toBuffer(), `welcome-${member.id}.png`);

            } else if (data.Type?.toLowerCase() === "swiftcord") {
                let background = data.Background;
                if (data.Background?.toLowerCase() === "default") background = "https://upload.serversmp.xyz/prince/ocHlRwuhEI.png";

                const image = await cord.Welcome()
                    .setUsername(member.user.username)
                    .setDiscriminator(member.user.discriminator)
                    .setMemberCount(member.guild.memberCount)
                    .setGuildName(member.guild.name)
                    .setGuildIcon(member.guild.iconURL({ format: "png" }))
                    .setAvatar(member.user.displayAvatarURL({ format: "png", size: 2048 }))
                    .setBackground(background)
                    .toAttachment();
                attachment = new AttachmentBuilder(image, `welcome-${member.id}.png`)

            } else if (data.Type?.toLowerCase() === "discord-welcomer") {

                let backgroundLink = data.Background;
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
                    roundImg(20, 20, canvas.width, canvas.height, r)
                    roundImg(-20, -20, canvas.width, canvas.height, r)
                    roundImg(-30, 30, canvas.width, canvas.height, r)
                    ctx.clip()
                    ctx.save()
                    roundImg(-30, -30, canvas.width, canvas.height, r)
                    ctx.clip()
                    ctx.save()
                    roundImg(-30, -30, canvas.width, canvas.height, r)
                    ctx.clip()
                    ctx.save()
                    roundImg(-30, -30, canvas.width, canvas.height, r)
                    roundImg(30, -30, canvas.width, canvas.height, r)
                    ctx.clip()
                    ctx.save()
                    roundImg(30, -30, canvas.width, canvas.height, r)
                    roundImg(30, 30, canvas.width, canvas.height, r)
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

                attachment = new AttachmentBuilder(canvas.toBuffer(), `welcome-${member.id}.png`);

            } else if (data.Type?.toLowerCase() === "text") {
                text = `Welcome **${member.user.tag}** to **${member.guild.name}**!`;

            }

            try {
                if (text !== null) return channel.send({
                    content: text
                })
                channel.send({
                    files: [attachment]
                })
            } catch (e) {
                channel.send({
                    content: `Welcome **${member.user.tag}** to **${member.guild.name}**! ||An error has occurred||`
                })
            }
        }
    });
});