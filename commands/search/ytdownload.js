const { isValidHttpUrl } = require("../../assets/api/url");
const { Message, Client } = require('discord.js');
const ytdl = require('ytdl-core');
const pathMaker = require('path');
const fs = require('fs');

module.exports = {
    name: "ytdownload",
    usage: "[url] [name]",
    description : "Download a video from YouTube.",

    /** 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async(client, message, args) => {
        const file = `${args[1]}.mp4`;
        const path = pathMaker.join(__dirname, '..', '..', 'temp', file);

        try {
            const url = args[0];

            if (!isValidHttpUrl(url)) return message.reply("Invalid url");

            if (!args[1]) return message.reply('Please provide a file name.');

            if (fs.existsSync(path)) return message.reply('Someone is already downloading a video with the same file name.');

            const stream = fs.createWriteStream(path);
            ytdl(url, { quality: 'highest', filter: 'audioandvideo' }).pipe(stream);

            message.reply(`Downloading <${url}> (this may take a while)`);

            stream.on('finish', async() => {
                fs.stat(path, async(err, { size }) => {
                    if (err) {
                        console.log(err);
                        fs.unlink(path, (err) => { if (err) console.log(err); });
                        return message.channel.send('Error downloading file.');
                    }

                    const premiumTier = message.guild.premiumTier;
                    const fileSizeMax = premiumTier === 'Tier3' ? 104857600 : premiumTier === 'Tier2' ? 52428800 : 20971520;

                    if (size > fileSizeMax) {
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
            if (fs.existsSync(path)) fs.unlink(path, (err) => { if (err) console.log(err); });
            message.reply("An error occured while downloading.");
        }
    }
}