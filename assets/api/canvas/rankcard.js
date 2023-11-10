const { hexToRGBA, generateShades, getLuminance, isTooBlackOrWhite } = require("../color");
const { shortenText, abbreviateNumber, circleImage, roundContext } = require("./index");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

async function canvacordRank(user) {
    const canvas = createCanvas(934, 282);
    const ctx = canvas.getContext("2d");

    // Load background image
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const background = user.background ? await loadImage(user.background) : null;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

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

async function discordRank(user) {
    const canvas = createCanvas(1000, 250);
    const ctx = canvas.getContext("2d");

    const bubbles = user.color;

    const shades = generateShades(bubbles, 50, 5);
    const background = getLuminance(bubbles) > 0.6 ? isTooBlackOrWhite(bubbles, "#ffffff").boolean ? shades.darker[44] : shades.brighter[44] : shades.darker[44];

    roundContext(ctx, 0, 0, canvas.width, canvas.height, 35);

    if (user.background) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        ctx.drawImage(await loadImage(user.background), 0, 0, canvas.width, canvas.height)

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    } else {
        ctx.fillStyle = background;
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(80, 110, 60, 0, Math.PI * 2, false);
    ctx.fillStyle = bubbles;
    ctx.fill();

    ctx.drawImage(await circleImage(user.avatar), 30, 65, 128, 128);

    ctx.beginPath();
    ctx.arc(140, 175, 20, 0, Math.PI * 2, false);
    ctx.fillStyle = background;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(136, 230, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.30).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(190, 80, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.1).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(220, 20, 11, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.5).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(400, 40, 9, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.07).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(500, 43, 12, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.4).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(465, 145, 35, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.1).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(560, 260, 30, 0, Math.PI * 2, false);
    ctx.fillStyle = bubbles;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(775, 227, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.15).toString();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(1000, 100, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = hexToRGBA(bubbles, 0.45).toString();
    ctx.fill();

    const statusColors = {
        "online": "#43B581",
        "idle": "#FAA61A",
        "dnd": "#F04747",
        "offline": "#747F8E",
        "streaming": "#593595",
    };
    const statusColor = statusColors[user.status] || "#747F8E";

    ctx.beginPath();
    ctx.arc(140, 175, 15, 0, Math.PI * 2, false);
    ctx.fillStyle = statusColor;
    ctx.fill();

    const barX = 175;
    const barY = 155;
    const borderRadius = 18.75;
    const barWidth = 800;
    const barHeight = 37.5;

    const progressWidth = (user.currentXP / user.requiredXP) * barWidth;

    ctx.fillStyle = hexToRGBA(bubbles, 0.5).toString();
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

    ctx.fillStyle = user.progressBar || bubbles;
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

    ctx.font = '32px Nunito';
    ctx.textAlign = 'right';

    const requiredXPWidth = ctx.measureText(`/${user.requiredXP} xp`).width;

    ctx.fillStyle = "#7F8384";
    ctx.fillText(`/${user.requiredXP} xp`, 970, 140);

    ctx.fillStyle = bubbles;
    ctx.fillText(String(user.currentXP), 970 - requiredXPWidth, 140);

    ctx.textAlign = 'left';
    ctx.fillStyle = bubbles;
    ctx.fillText(String(user.username), 175, 140);

    let xText = 970;

    ctx.font = 'bold 50px Nunito';
    ctx.textAlign = 'right';

    ctx.fillStyle = bubbles;
    ctx.fillText(String(user.rank), xText, 60);

    xText = xText - ctx.measureText(String(user.rank)).width - 5;

    ctx.font = '32px Nunito';
    ctx.fillText("RANK", xText, 60);

    xText = xText - ctx.measureText("RANK").width - 5;

    ctx.font = 'bold 50px Nunito';
    ctx.fillText(String(user.level), xText, 60);

    xText = xText - ctx.measureText(String(user.level)).width - 5;

    ctx.font = '32px Nunito';
    ctx.fillText("LVL", xText, 60);

    return canvas.toBuffer('image/png');
}

module.exports = {
    canvacordRank,
    discordRank
}