const { createCanvas, loadImage } = require('@napi-rs/canvas');

const { drawRoundedImage, combineImages, shortenText, abbreviateNumber } = require("./index");
const { isTooBlackOrWhite } = require("../color");

async function generateLeaderboard(users) {
    const buffers = [];

    for (let i = 0; i < users.length; i++) {
        const userCanvas = createCanvas(680, 70);
        const userCtx = userCanvas.getContext('2d');

        const user = users[i];

        userCtx.fillStyle = '#393f4475';
        userCtx.fillRect(0, 0, 680, 70);

        const avatar = await loadImage(user.avatar);
        userCtx.drawImage(avatar, 0, 0, 70, 70);

        userCtx.fillStyle = 'white';
        userCtx.font = '24px Noto Sans';
        userCtx.fillText(`${shortenText(user.username, 11)}`, 80, 45);

        userCtx.textAlign = 'right';
        userCtx.font = '24px Noto Sans Bold';
        i === 0 ? userCtx.fillStyle = '#e7ba16' : i === 1 ? userCtx.fillStyle = '#9e9e9e' : i === 2? userCtx.fillStyle = '#94610f' : null;
        userCtx.fillText(`#${user.position}`, 670, 45);

        const barX = 275;
        const barY = 10;
        const borderRadius = 18.75;
        const barWidth = 300;
        const barHeight = 50;

        const progressWidth = (user.currentXP / user.requiredXP) * barWidth;

        userCtx.fillStyle = "#484b4E";
        userCtx.beginPath();
        userCtx.moveTo(barX + borderRadius, barY);
        userCtx.lineTo(barX + barWidth - borderRadius, barY);
        userCtx.arc(barX + barWidth - borderRadius, barY + borderRadius, borderRadius, -Math.PI / 2, 0);
        userCtx.lineTo(barX + barWidth, barY + barHeight - borderRadius);
        userCtx.arc(barX + barWidth - borderRadius, barY + barHeight - borderRadius, borderRadius, 0, Math.PI / 2);
        userCtx.lineTo(barX + borderRadius, barY + barHeight);
        userCtx.arc(barX + borderRadius, barY + barHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
        userCtx.lineTo(barX, barY + borderRadius);
        userCtx.arc(barX + borderRadius, barY + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
        userCtx.closePath();
        userCtx.fill();

        userCtx.fillStyle = user.progressBar || "#ffffff";
        userCtx.beginPath();
        userCtx.moveTo(barX + borderRadius, barY);
        userCtx.lineTo(barX + progressWidth - borderRadius, barY);
        userCtx.arc(barX + progressWidth - borderRadius, barY + borderRadius, borderRadius, -Math.PI / 2, 0);
        userCtx.lineTo(barX + progressWidth, barY + barHeight - borderRadius);
        userCtx.arc(barX + progressWidth - borderRadius, barY + barHeight - borderRadius, borderRadius, 0, Math.PI / 2);
        userCtx.lineTo(barX + borderRadius, barY + barHeight);
        userCtx.arc(barX + borderRadius, barY + barHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
        userCtx.lineTo(barX, barY + borderRadius);
        userCtx.arc(barX + borderRadius, barY + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
        userCtx.closePath();
        userCtx.fill();

        const textColor = isTooBlackOrWhite(user.progressBar, "#ffffff").boolean === true ? "#000000" : "#ffffff";

        userCtx.textAlign = 'left';
        userCtx.font = '24px Noto Sans';
        userCtx.fillStyle = textColor;
        userCtx.fillText(`${abbreviateNumber(user.currentXP)}/${abbreviateNumber(user.requiredXP)} (${user.level})`, 280, 44);

        const result = await drawRoundedImage(await loadImage(userCanvas.toBuffer("image/png")), 10, true)

        buffers.push(result.toBuffer("image/png"));
    }

    const buffer = await combineImages(buffers, { width: 680, height: 70, columns: 1, padding: 5 });

    const canvas = createCanvas(680, buffers.length * 75);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#23272a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lb = await loadImage(buffer);
    ctx.drawImage(lb, 0, 0, 680, buffers.length * 75);

    return canvas.toBuffer("image/png");
}

module.exports = {
    generateLeaderboard
}