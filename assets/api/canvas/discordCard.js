const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { shortenText, drawRoundedImage } = require("./index");

async function createCard(options) {
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

module.exports = {
    createCard
}