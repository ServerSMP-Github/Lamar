const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { shortenText, abbreviateNumber } = require("./index");

async function createRankCard(user) {
    const canvas = createCanvas(934, 282);
    const ctx = canvas.getContext("2d");

    // Load background image
    const background = user.background ? await loadImage(user.background) : null;
    if (background) ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    else {
        ctx.fillStyle = "#23272a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#2a2e35";
        ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    }

    // Draw user info
    const name = shortenText(user.username, 10);
    ctx.font = `bold 36px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";
    ctx.fillText(`${name}`, 257 + 18.5, 164);

    // const discriminator = user.discriminator.substr(0, 4);
    // ctx.font = `36px Arial`;
    // ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    // ctx.textAlign = "center";
    // ctx.fillText(`#${discriminator}`, ctx.measureText(name).width + 20 + 335, 164);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`RANK #${user.rank}    LEVEL ${user.level}`, 870, 82);

    // Draw progress bar
    const barX = 275.5;
    const barY = 183.75;
    const borderRadius = 18.75;
    const barWidth = 596.5;
    const barHeight = 37.5;

    const progressWidth = (user.currentXP / user.requiredXP) * barWidth;

    ctx.fillStyle = "#484b4E";
    ctx.beginPath();
    ctx.moveTo(barX + borderRadius, barY);
    ctx.lineTo(barX + barWidth - borderRadius, barY);
    ctx.arc(barX + barWidth - borderRadius, barY + borderRadius, borderRadius, -Math.PI / 2, 0);
    ctx.lineTo(barX + barWidth, barY + barHeight - borderRadius);
    ctx.arc(barX + barWidth - borderRadius, barY + barHeight - borderRadius, borderRadius, 0, Math.PI / 2);
    ctx.lineTo(barX + borderRadius, barY + barHeight);
    ctx.arc(barX + borderRadius, barY + barHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
    ctx.lineTo(barX, barY + borderRadius);
    ctx.arc(barX + borderRadius, barY + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = user.progressBar || "#ffffff";
    ctx.beginPath();
    ctx.moveTo(barX + borderRadius, barY);
    ctx.lineTo(barX + progressWidth - borderRadius, barY);
    ctx.arc(barX + progressWidth - borderRadius, barY + borderRadius, borderRadius, -Math.PI / 2, 0);
    ctx.lineTo(barX + progressWidth, barY + barHeight - borderRadius);
    ctx.arc(barX + progressWidth - borderRadius, barY + barHeight - borderRadius, borderRadius, 0, Math.PI / 2);
    ctx.lineTo(barX + borderRadius, barY + barHeight);
    ctx.arc(barX + borderRadius, barY + barHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
    ctx.lineTo(barX, barY + borderRadius);
    ctx.arc(barX + borderRadius, barY + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Draw user's current and required XP
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`${abbreviateNumber(user.currentXP)} / ${abbreviateNumber(user.requiredXP)}`, 800, 164);

    // Set user status color
    const statusColors = {
        "online": "#43B581",
        "idle": "#FAA61A",
        "dnd": "#F04747",
        "offline": "#747F8E",
        "streaming": "#593595",
    };
    const statusColor = statusColors[user.status.style] || "#747F8E";

    // Draw user's profile picture
    const profilePic = await loadImage(user.avatar);
    ctx.save();
    ctx.beginPath();
    ctx.arc(125 + 10, 125 + 20, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profilePic, 35, 45, 200, 200);
    ctx.restore();

    // Draw user status circle
    if (user.status.type) {
        ctx.beginPath();
        ctx.fillStyle = statusColor;
        ctx.arc(215, 205, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 5;
        ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
    }

    // Save image
    return canvas.toBuffer("image/png");
}

module.exports = {
    createRankCard
}