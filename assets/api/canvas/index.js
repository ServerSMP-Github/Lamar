const { createCanvas, loadImage } = require("@napi-rs/canvas");

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
    if (num >= 1e12) return Math.floor(num / 1e9) + 'B';
    else if (num >= 1e9) return Math.floor(num / 1e9) + (num % 1e9 >= 500e6 ? 1 : 0) + 'B';
    else if (num >= 1e6) return Math.floor(num / 1e6) + (num % 1e6 >= 500e3 ? 1 : 0) + 'M';
    else if (num >= 1000) return Math.floor(num / 1000) + (num % 1000 >= 500 ? 1 : 0) + 'K';
    else return num.toString();
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

async function circleImage(url) {
    const image = await loadImage(url);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(image.width / 2, image.height / 2, Math.min(image.width, image.height) / 2, 0, 2 * Math.PI);
    ctx.clip();

    ctx.drawImage(image, 0, 0);

    return canvas;
}

function roundContext(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

async function combineImages(imageBuffers, { width = 1000, height = null, columns = 4, padding = 10 }) {
    const imageWidth = (width - (padding * (columns + 1))) / columns;
    const imageHeight = height || imageWidth;

    const canvasRows = Math.ceil(imageBuffers.length / columns);
    const canvasHeight = (imageHeight * canvasRows) + (padding * (canvasRows + 1));

    const canvas = createCanvas(width, canvasHeight);
    const ctx = canvas.getContext('2d');

    let x = padding;
    let y = padding;

    for (let i = 0; i < imageBuffers.length; i++) {
        const image = await loadImage(imageBuffers[i]);
        ctx.drawImage(image, x, y, imageWidth, imageHeight);

        x += imageWidth + padding;
        if ((i + 1) % columns === 0) {
            x = padding;
            y += imageHeight + padding;
        }
    }

    return canvas.toBuffer('image/png');
}

module.exports = {
    drawRoundedImage,
    abbreviateNumber,
    combineImages,
    roundContext,
    circleImage,
    shortenText,
    applyText,
    wrapText
}