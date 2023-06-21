const { createCanvas } = require("@napi-rs/canvas");
const { randomHexColor } = require("../color");
const { month } = require("../time");

module.exports = (title, data) => {
    const canvasWidth = 1000;
    const canvasHeight = 1000;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const barData = data;

    const chartPadding = 30;
    const maxBarHeight = canvasHeight - chartPadding * 2;
    const spacing = 10;
    const barWidth = (canvasWidth - chartPadding * 2 - spacing * (barData.length - 1)) / barData.length;
    const fontSize = 14;
    const labelOffset = 5;

    ctx.fillStyle = 'white';
    ctx.font = `bold ${fontSize + 4}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(title, canvasWidth / 2, chartPadding - 10);

    for (let i = 0; i < barData.length; i++) {
        const maxDataValue = Math.max(...barData);
        const barHeight = maxDataValue !== 0 ? (barData[i] / maxDataValue) * maxBarHeight : 0;
        const x = chartPadding + (barWidth + spacing) * i;
        const y = canvasHeight - chartPadding - barHeight;

        const barColor = randomHexColor();
        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = 'white';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(month[i].toString(), x + barWidth / 2, y + barHeight + fontSize + labelOffset);

        ctx.fillStyle = 'white';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(barData[i].toString(), x + barWidth / 2, y - fontSize - labelOffset);
    }

    return canvas.toBuffer('image/png');
}