const colors = require('./colors.json');

const isValidHexCode = (color) => color.match(/^#[0-9a-f]{6}$/i);

function hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}

function findClosestColor(color) {
    let closestColor = null;

    if (isValidHexCode(color)) {
        const { r, g, b } = hexToRGB(color);

        const result = Object.keys(colors).reduce((acc, c) => {
            const { r: cr, g: cg, b: cb } = hexToRGB(c);

            const d = Math.sqrt(((r - cr) * (r - cr)) + ((g - cg) * (g - cg)) + ((b - cb) * (b - cb)));

            if (d < acc.min) {
                acc.min = d;
                acc.color = c;
            }

            return acc;
        }, {
            min: Number.MAX_SAFE_INTEGER,
            color: null,
        });

        closestColor = result.color;
    } else closestColor = '#000000';

    return colors[closestColor];
}

module.exports = {
    findClosestColor,
    isValidHexCode,
    hexToRGB
}