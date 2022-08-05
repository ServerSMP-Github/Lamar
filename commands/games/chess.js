const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const getBoardBase64Node = require("@treasure-chess/chess-image-generator/src/node/getBoardBase64-node");
const { getBoardLayout } = require("@treasure-chess/chess-image-generator");
const pgnParser = require("../../assets/js/pgn-parser.js");
const { createCanvas, Image } = require('canvas');
const GIFEncoder = require("gif-encoder-2");
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'chess',
    usage: '[ pgn data ]',
    description : "Turn PGN data into a chess gif",

    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        if (!args.length) return message.channel.send("Please provide some PGN data");

        const gameData = pgnParser.parse(String(args.join(" ")))[0];

        let max = 0;
        let array = [];
        await new Promise(async(resolve) => {
            gameData.moves.forEach(function(data, index) {
                const move = data.move;
                if (!move) return;
                array.push(`${index + 1}.${move}`);
                max = index;
                if (gameData.moves.length - 1 === index) resolve();
            });
        });

        const encoder = new GIFEncoder(500, 500, 'neuquant');
        encoder.setDelay(500);
        encoder.start();

        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext('2d'); 

        let index = 0;
        Promise.all(
            await new Promise(async(resolve2) => {
                for (const move of array) {
                    const boardLayout = getBoardLayout(String(array.slice(0, index + 1).join(",")));
                    const boardBase64 = await getBoardBase64Node(
                        boardLayout,
                        "black",
                        {
                            size: 500,
                            dark: "rgb(181, 137, 98)",
                            light: "rgb(241, 216, 180)",
                            style: "neo",
                        }
                    );
                    index = index + 1;

                    const image = new Image()
                    image.onload = () => {
                        ctx.drawImage(image, 0, 0, 500, 500);
                        encoder.addFrame(ctx);
                        resolve2();
                    }
                    image.src = boardBase64;

                    if (index === max) {

                        const random = Math.floor(Math.random() * Math.pow(2, 16)).toString(16);

                        fs.writeFile(path.join(__dirname, '..', '..', 'temp', `chess-${random}.gif`), encoder.out.getData(), (error) => {
                            if (error) return message.channel.send("Error writing file");

                            client.ffmpeg(path.join(__dirname, '..', '..', 'temp', `chess-${random}.gif`))
                                .toFormat('mp4')
                                .size('500x500')
                                .output(path.join(__dirname, '..', '..', 'temp', `chess-${random}.mp4`))
                                .on('end', () => {

                                    message.channel.send({
                                        files: [new MessageAttachment(path.join(__dirname, '..', '..', 'temp', `chess-${random}.mp4`), "chess.mp4")]
                                    });

                                    setTimeout(() => {
                                        fs.unlink(path.join(__dirname, '..', '..', 'temp', `chess-${random}.mp4`), (err) => {
                                            if (err) console.log(err);
                                        });

                                        fs.unlink(path.join(__dirname, '..', '..', 'temp', `chess-${random}.gif`), (err) => {
                                            if (err) console.log(err);
                                        });
                                    }, 10000);
                                })
                                .on('error', (err) => message.channel.send("Error converting file"))
                                .run();
                        });
                    }
                }
            })
        )

    }
}