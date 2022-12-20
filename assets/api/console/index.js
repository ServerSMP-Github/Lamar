const { hexToRGB } = require("../color");

function fgYellow(string) {
    return `\x1b[33m${string}\x1b[0m`;
}

function fgGreen(string) {
    return `\x1b[32m${string}\x1b[0m`;
}

function fgWhite(string) {
    return `\x1b[37m${string}\x1b[0m`;
}

function fgBlue(string) {
    return `\x1b[34m${string}\x1b[0m`;
}

function fgGray(string) {
    return `\x1b[90m${string}\x1b[0m`;
}

function fgRed(string) {
    return `\x1b[31m${string}\x1b[0m`;
}

function bold(string) {
    return `\u001b[1m${string}\u001b[22m`;
}

function gradient(string, colors) {
    const lines = string.split('\n');

    const colorRGB = [];
    for (const color of colors) colorRGB.push(hexToRGB(color));

    let index = 0;
    const results = [];
    for (const line of lines) {
        const lineColors = colorRGB[index];

        index++
        index === colors.length ? index = 0 : null;

        results.push(`\x1b[38;2;${lineColors.r};${lineColors.g};${lineColors.b}m${line}\x1b[0m`);
    }

    return results.join('\n');
}

module.exports = {
    fgYellow,
    gradient,
    fgGreen,
    fgWhite,
    fgBlue,
    fgGray,
    fgRed,
    bold
}