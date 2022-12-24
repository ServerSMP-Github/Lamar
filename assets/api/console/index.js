const { hexToRGB } = require("../color");

function fgYellow(string) {
    if (process.stdout.hasColors) return `\x1b[33m${string}\x1b[0m`;
    else return string;
}

function fgGreen(string) {
    if (process.stdout.hasColors) return `\x1b[32m${string}\x1b[0m`;
    else return string;
}

function fgWhite(string) {
    if (process.stdout.hasColors) return `\x1b[37m${string}\x1b[0m`;
    else return string;
}

function fgBlue(string) {
    if (process.stdout.hasColors) return `\x1b[34m${string}\x1b[0m`;
    else return string;
}

function fgGray(string) {
    if (process.stdout.hasColors) return `\x1b[90m${string}\x1b[0m`;
    else return string;
}

function fgCyan(string) {
    if (process.stdout.hasColors) return `\x1b[36m${string}\x1b[0m`;
    else return string;
}

function fgRed(string) {
    if (process.stdout.hasColors) return `\x1b[31m${string}\x1b[0m`;
    else return string;
}

function bold(string) {
    if (process.stdout.hasColors) return `\u001b[1m${string}\u001b[22m`;
    else return string;
}

function gradient(string, colors) {
    if (!process.stdout.hasColors) return string;

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

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let i = 0;

function createSpinner(text) {
    let interval;

    function start() {
        interval = setInterval(() => {
            process.stdout.write(`\r${fgCyan(frames[i])} ${text}`);
            i = (i + 1) % frames.length;
        }, 50);
    }

    function stop() {
        clearInterval(interval);
    }

    function succeed() {
        stop();
        console.log(`\r${fgGreen("✔")} ${text}`);
    }

    function fail() {
        stop();
        console.log(`\r${fgRed("✖")} ${text}`);
    }

    return {
        start,
        stop,
        succeed,
        fail
    };
}

module.exports = {
    createSpinner,
    fgYellow,
    gradient,
    fgGreen,
    fgWhite,
    fgBlue,
    fgGray,
    fgCyan,
    fgRed,
    bold
}