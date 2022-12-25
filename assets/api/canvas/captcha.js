const { generatePassword, generateRandomNumber, getRandomInt } = require("../crypto");
const { createCanvas } = require("@napi-rs/canvas");

module.exports = () => {
    const width = [10, 50, 100, 150, 200, 250];

    const canvas = createCanvas(300, 100);
    const ctx = canvas.getContext("2d");

    const randomString = generatePassword(3);

    const numLetters = generateRandomNumber(20);

    for (let i = 0; i < numLetters; i++) {
        const x = getRandomInt(0, canvas.width);
        const y = getRandomInt(0, canvas.height);

        const letter = generatePassword(1);

        ctx.font = '24px sans-serif';
        ctx.fillStyle = '#545556';

        ctx.fillText(letter, x, y);
    }

    ctx.strokeStyle = '#32cf7e';
    ctx.lineWidth = 3;

    for (let i = 0; i < randomString.length; i++) {
        const letter = randomString.charAt(i);

        const x = width[i];
        const y = getRandomInt(25, 75);

        ctx.font = '34px sans-serif';
        ctx.fillStyle = '#2fae6e';

        ctx.fillText(letter, x, y);
        ctx.lineTo(x, y - 10);
    }

    ctx.stroke();

    return {
        text: randomString,
        image: canvas.toBuffer('image/png')
    }
}