const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { drawRoundedImage } = require("./index");

module.exports = async(avatar) => {
    const canvas = createCanvas(1000, 350);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("assets/image/boost.png");
    ctx.drawImage(bg, 0, 0, 1000, 350);

    const profile = await loadImage(avatar);
    ctx.drawImage(await drawRoundedImage(profile, profile.width / 2, profile.width / 2), 710, 50, 256, 256);

    return canvas.toBuffer("image/png");
}