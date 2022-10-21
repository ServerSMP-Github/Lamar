const { isValidHttpUrl } = require("../../assets/api/url");
const { Message, Client } = require('discord.js');
const ytdl = require('ytdl-core');
const pathMaker = require('path');
const fs = require('fs');

module.exports = {
    name: "ytdownload",
    usage: "[url]",
    description : "Downloads a video from youtube",

    /** 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async(client, message, args) => {
        try {
            const file = args[0];
            const url = args[1];

            if (!isValidHttpUrl(url)) return message.reply("Invalid url");

            if (!file) return message.reply('Please provide a file name with the extension.');
            if (!['mp4', 'webm'].includes(file.split('.')[1])) return message.reply('Please provide a valid file type.');

            const path = pathMaker.join(__dirname, '..', '..', 'temp', file);

            if (fs.existsSync(path)) return message.reply('Someone is already downloading a video with the same file name.');

            const stream = fs.createWriteStream(path);
            ytdl(url, { filter: format => format.container === file.split('.')[1] }).pipe(stream);

            stream.on('finish', async() => {
                fs.stat(path, async(err, { size }) => {
                    if (err) {
                        console.log(err);
                        fs.unlink(path, (err) => { if (err) console.log(err); });
                        return message.channel.send('Error downloading file.');
                    }

                    let filesizemax = 8000000;

                    if (message.guild.premiumTier === 'TIER_2') filesizemax = 5000000;
                    if (message.guild.premiumTier === 'TIER_3') filesizemax = 10000000;

                    if (size > filesizemax) {
                        message.reply('Sorry, the file is too big to send.');
                        fs.unlink(path, (err) => { if (err) console.log(err); });
                    } else {
                        await message.reply({
                            content: 'File downloaded!',
                            files: [{
                                name: file,
                                attachment: path,
                            }],
                        }).then(() => {
                            fs.unlink(path, (err) => { if (err) console.log(err); });
                        });
                    }
                });
            });

            stream.on('error', (err) => {
                if (fs.existsSync(path)) fs.unlink(path, (err) => { if (err) console.log(err); });
                message.reply('An error occured while downloading.');
            });
        } catch (error) {
            message.reply("An error occured while downloading.");
        }
    }
}