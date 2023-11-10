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

function hexToRGBA(hex, alpha) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgba = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: alpha ? alpha : 1
    } : {
        r: 0,
        g: 0,
        b: 0,
        a: 1
    };

    rgba.toString = function () {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    };

    return rgba;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max == min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}

function rgbToHsv(r, g, b) {
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h, s, v = max;

    v = Math.floor(max / 255 * 100);

    if (max != 0) s = Math.floor(delta / max * 100);
    else return [0, 0, 0];

    if (r == max) h = (g - b) / delta;
    else if (g == max) h = 2 + (b - r) / delta;
    else h = 4 + (r - g) / delta;

    h = Math.floor(h * 60);
    if (h < 0 ) h += 360;

    return [h, s, v];
}

function rgbToCmyk(r, g, b, normalized) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    if (!normalized) {
        c = Math.round(c * 10000) / 100;
        m = Math.round(m * 10000) / 100;
        y = Math.round(y * 10000) / 100;
        k = Math.round(k * 10000) / 100;
    }

    c = isNaN(c) ? 0 : c;
    m = isNaN(m) ? 0 : m;
    y = isNaN(y) ? 0 : y;
    k = isNaN(k) ? 0 : k;

    return {
        c: c,
        m: m,
        y: y,
        k: k
    }
}

function componentToHex(c) {
    const hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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

function randomHexColor() {
    const letters = "0123456789ABCDEF";
    let color = '#';

    for (var i = 0; i < 6; i++) color += letters[(Math.floor(Math.random() * 16))];

    return color;
}

function distanceColor(c1, c2) {
    const r1 = c1.R;
    const g1 = c1.G;
    const b1 = c1.B;

    const r2 = c2.R;
    const g2 = c2.G;
    const b2 = c2.B;

    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function nearestColor(target, referenceColors) {
    let minDistance = Infinity;
    let nearestColor = null;

    for (const color of referenceColors) {
        const distance = distanceColor(target, color);
        if (distance < minDistance) {
            minDistance = distance;
            nearestColor = color;
        }
    }

    return nearestColor;
}

function generateShades(color, steps, stepSize = 20) {
    const rgb = hexToRGB(color);
    const shades = {
        brighter: [],
        darker: []
    };

    for (let i = 1; i <= steps; i++) {
        const newColor = {
            r: Math.max(0, Math.min(255, rgb.r - (i * stepSize))),
            g: Math.max(0, Math.min(255, rgb.g - (i * stepSize))),
            b: Math.max(0, Math.min(255, rgb.b - (i * stepSize)))
        };

        shades.darker.push(rgbToHex(newColor.r, newColor.g, newColor.b));
    }

    for (let i = 1; i <= steps; i++) {
        const newColor = {
            r: Math.max(0, Math.min(255, rgb.r + (i * stepSize))),
            g: Math.max(0, Math.min(255, rgb.g + (i * stepSize))),
            b: Math.max(0, Math.min(255, rgb.b + (i * stepSize)))
        };

        shades.brighter.push(rgbToHex(newColor.r, newColor.g, newColor.b));
    }

    return shades;
}

function getLuminance(hexColor) {
    const color = hexColor.replace('#', '');

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance;
}

function isTooBlackOrWhite(color, standard) {
    if (!color) color = standard;

    if (typeof color === 'string' && isValidHexCode(color)) {
        const { r, g, b } = hexToRGB(color);

        color = [r, g, b];
    } else return { boolean: false, message: "Invalid color" };

    const [red, green, blue] = color;

    const blackThreshold = 30;
    const whiteThreshold = 225;

    if (red <= blackThreshold && green <= blackThreshold && blue <= blackThreshold) return { boolean: true, message: "Too black" };
    else if (red >= whiteThreshold && green >= whiteThreshold && blue >= whiteThreshold) return { boolean: true, message: "Too white" };
    else return { boolean: false, message: "Not too black or too white" };
}

module.exports = {
    isTooBlackOrWhite,
    findClosestColor,
    generateShades,
    isValidHexCode,
    randomHexColor,
    nearestColor,
    getLuminance,
    rgbToCmyk,
    hexToRGBA,
    hexToRGB,
    rgbToHsv,
    rgbToHsl,
    rgbToHex
}