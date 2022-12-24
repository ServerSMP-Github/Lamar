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

module.exports = {
    applyText,
    wrapText
}