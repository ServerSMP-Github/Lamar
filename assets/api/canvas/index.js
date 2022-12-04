function applyText(canvas, text, defaultFontSize, width, font) {
    const ctx = canvas.getContext(`2d`);

    do ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
    while (ctx.measureText(text).width > width);

    return ctx.font;
}

module.exports = { applyText };