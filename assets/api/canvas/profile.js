const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { circleImage, abbreviateNumber, shortenText } = require("./index");
const { DMY } = require("../time");

const status = {
    online: "assets/image/profile/status/online.png",
    idle: "assets/image/profile/status/idle.png",
    dnd: "assets/image/profile/status/dnd.png",
    streaming: "assets/image/profile/status/streaming.png",
    offline: "assets/image/profile/status/offline.png",
};

async function createProfile(user) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2a2e35';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(await loadImage("assets/image/profile/shadow/shadow.png"), 0, 0, 512, 512);
    ctx.drawImage(await circleImage(user.avatar), 13, 15, 150, 150);
    ctx.drawImage(await loadImage(status[user.status]), 13, 15, 150, 150);

    if (user.bot.owners.includes(user.id)) ctx.drawImage(await circleImage(user.bot.avatar), 120, 120, 40, 40);
    if (user.guildOwner === user.id) ctx.drawImage(await loadImage("assets/image/profile/extra/crown.png"), 13, 120, 40, 40);

    ctx.font = '45px Arial';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(shortenText(user.username, 12), 167, 110);

    ctx.font = '20px Arial'
    ctx.rotate(0)
    ctx.fillStyle = "#AAAAAA";
    ctx.textAlign = "left";
    ctx.fillText(`XP: ${abbreviateNumber(user.currentXP)}/${abbreviateNumber(user.requiredXP)}`, 20, 325);

    ctx.font = '20px Arial'
    ctx.rotate(0)
    ctx.fillStyle = "#AAAAAA";
    ctx.textAlign = "left";
    ctx.fillText(`Level: ${user.level}`, 20, 300);

    const percent = Math.round(user.currentXP / user.requiredXP * 100);

    ctx.beginPath();
    ctx.rect(185, 285, 300, 40);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(185, 285, (percent / 100) * 300, 40);
    ctx.fillStyle = user.progressBar;
    ctx.fill();

    ctx.beginPath();
    ctx.rect(185, 285, 300, 40);
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    ctx.font = 'italic 26px Arial'
    ctx.rotate(0)
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.fillText(`${percent}%`, 195, 315);

    ctx.font = '15px Arial'
    ctx.rotate(0)
    ctx.fillStyle = "#AAAAAA";
    ctx.textAlign = "left";
    ctx.fillText(DMY(), 15, 490);

    return canvas.toBuffer("image/png");
}

module.exports = {
    createProfile
}