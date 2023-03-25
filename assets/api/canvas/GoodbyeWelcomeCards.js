const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { shortenText, drawRoundedImage } = require("./index");

async function discordWelcomeCard(options) {
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    // Draw the rounded rectangle path
    if (options.rounded) {
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(675, 0);
        ctx.quadraticCurveTo(700, 0, 700, 25);
        ctx.lineTo(700, 225);
        ctx.quadraticCurveTo(700, 250, 675, 250);
        ctx.lineTo(25, 250);
        ctx.quadraticCurveTo(0, 250, 0, 225);
        ctx.lineTo(0, 25);
        ctx.quadraticCurveTo(0, 0, 25, 0);
        ctx.closePath();
        ctx.clip();
    }

    // Draw the image inside the clipping path
    const theme = {
        "dark": "assets/image/welcome/discord-welcome-card/dark.png",
        "code": "assets/image/welcome/discord-welcome-card/code.png",
        "circuit": "assets/image/welcome/discord-welcome-card/circuit.png",
    }

    const background = await loadImage(theme[options.theme]);
    ctx.drawImage(background, 0, 0, 700, 250);

    // Apply the blur filter to the temporary canvas
    if (options.blur) {
        ctx.filter = `blur(3px)`;
        ctx.drawImage(canvas, 0, 0, 700, 250);
        ctx.filter = `blur(0px)`;

        // Draw un-blurred version of image
        if (options.border) ctx.drawImage(await drawRoundedImage(background, 17, options.rounded), 10, 10, 680, 230);
    }

    // Draw the border on the original canvas
    if (options.border) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 20;

        if (options.rounded) {
            ctx.beginPath();
            ctx.moveTo(25, 0);
            ctx.lineTo(675, 0);
            ctx.arcTo(700, 0, 700, 25, 25);
            ctx.lineTo(700, 225);
            ctx.arcTo(700, 250, 675, 250, 25);
            ctx.lineTo(25, 250);
            ctx.arcTo(0, 250, 0, 225, 25);
            ctx.lineTo(0, 25);
            ctx.arcTo(0, 0, 25, 0, 25);
            ctx.closePath();
            ctx.stroke();
        } else ctx.strokeRect(0, 0, 700, 250);
    }

    // Add users avatar
    ctx.save();

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2);
    ctx.clip();

    const avatar = await loadImage(options.avatar);
    ctx.drawImage(avatar, 25, 25, 200, 200);

    ctx.restore();

    // Draw title
    ctx.font = `30px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${shortenText(options.text.title, 25)}`, 259, 71);

    // Draw user tag
    ctx.font = `28px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${shortenText(options.text.user, 25)}`, 259, 138);

    // Draw subtitle
    ctx.font = `25px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${shortenText(options.text.subtitle, 30)}`, 259, 192);

    // Save image
    return canvas.toBuffer("image/png");
}

async function discordWelcomer(options) {
    const background = options.background ? options.background === "invisible" ? "assets/image/welcome/discord-welcomer/invisible.png" : options.background : "assets/image/welcome/discord-welcomer/default.png";

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

    const bg = await loadImage(background);

    ctx.drawImage(bg, 30, 30, 739, 209);
    ctx.filter = 'blur(5px)';

    ctx.drawImage(bg, 30, 30, 739, 209);
    ctx.filter = 'none';

    ctx.font = `bold 40px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.fillText(`${options.title}`, 335, 113);

    ctx.font = `bold 35px Arial`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.fillText(`${options.username}`, 420, 170);

    ctx.beginPath();
    ctx.arc(140, 140, 85, 0, Math.PI * 2, false);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(140, 140, 85, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.shadowBlur = 10;

    const avatar = await loadImage(options.avatar);
    ctx.drawImage(avatar, 40, 40, 185, 185);

    return canvas.toBuffer("image/png");
}

async function popcat(options) {
    const canvas = createCanvas(1024, 500);
    const ctx = canvas.getContext('2d');

    const background = await loadImage("assets/image/welcome/popcat/background.png");
    ctx.drawImage(background, 0, 0, 1024, 500);

    ctx.font = '65px Fredoka One';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${options.user.username}`, 512, 355);

    ctx.font = '40px Fredoka One';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${options.text.title}`, 512, 410);

    ctx.font = '30px Fredoka One';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${options.text.subtitle}`, 512, 455);

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

    const avatar = await loadImage(options.user.avatar);
    ctx.drawImage(avatar, 415, 75, 200, 200);

    return canvas.toBuffer("image/png");
}

async function swiftcord(options) {
    const background = options.background ? options.background : "assets/image/welcome/popcat/background.png";

    const username = options.user.username;
    const server = options.server.name;

    const base = await loadImage(options.type === "welcome" ? "assets/image/welcome/swiftcord/welcome.png" : "assets/image/welcome/swiftcord/goodbye.png");

    const canvas = createCanvas(base.width, base.height);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage(background);

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(base, 0, 0);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Manrope bold";
    ctx.fillText(`${options.server.title}`, 5, 435);

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
    ctx.fillText(`${options.user.discriminator}`, tagLength + 100, 390);

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
    const guildIco = await loadImage(options.server.icon);
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
    const avatar = await loadImage(options.user.avatar);
    ctx.drawImage(avatar, 45, 40, 270, 270);
    ctx.restore();

    return canvas.toBuffer("image/png");
}

async function ultrax(options) {
    const font = options.font || "Arial";

    const canvas = createCanvas(1024, 500);
    const ctx = canvas.getContext('2d');

    const background = options.background ? options.background : "assets/image/welcome/popcat/background.png";

    const bg = await loadImage(background);
    ctx.drawImage(bg, 0, 0, 1024, 500);

    const color = options.color ? options.color : "#ffffff";

    ctx.font = `65px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(`${options.user.username}`, 512, 355);

    ctx.font = `40px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(`${options.text.title}`, 512, 410);

    ctx.font = `30px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(`${options.text.subtitle}`, 512, 455);

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

    const avatar = await loadImage(options.user.avatar);
    ctx.drawImage(avatar, 415, 75, 200, 200);

    return canvas.toBuffer("image/png");
}

module.exports = {
    discordWelcomeCard,
    discordWelcomer,
    swiftcord,
    ultrax,
    popcat
}