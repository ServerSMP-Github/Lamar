const { createCanvas } = require("@napi-rs/canvas");

function applyText(canvas, text, defaultFontSize, width, font) {
    const ctx = canvas.getContext(`2d`);

    do ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
    while (ctx.measureText(text).width > width);

    return ctx.font;
}

function wrapText(ctx, text, maxWidth) {
    const lines = [];
    let line = '';

    text.split(' ').forEach(word => {
        if (ctx.measureText(`${line} ${word}`).width < maxWidth) line += ` ${word}`;
        else {
            lines.push(line.trim());
            line = word;
        }
    });

    lines.push(line.trim());

    return lines;
}

function shortenText(text, len) {
    return text.length <= len ? text : text.substr(0, len).trim() + "...";
}

function abbreviateNumber(num) {
    return num >= 1000 ? Math.floor(num / 1000) + (num % 1000 >= 500 ? 1 : 0) + "k" : num.toString();
}

async function drawRoundedImage(image, cornerRadius, rounded) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    if (rounded) {
        ctx.beginPath();
        ctx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
        ctx.lineTo(canvas.width - cornerRadius, 0);
        ctx.arc(canvas.width - cornerRadius, cornerRadius, cornerRadius, 1.5 * Math.PI, 0);
        ctx.lineTo(canvas.width, canvas.height - cornerRadius);
        ctx.arc(canvas.width - cornerRadius, canvas.height - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
        ctx.lineTo(cornerRadius, canvas.height);
        ctx.arc(cornerRadius, canvas.height - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
        ctx.closePath();
        ctx.clip();
    }

    ctx.drawImage(image, 0, 0);

    return canvas;
}

module.exports = {
    drawRoundedImage,
    abbreviateNumber,
    shortenText,
    applyText,
    wrapText
}