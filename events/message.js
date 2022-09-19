const SchemaAntiInvite = require("../models/moderator/anti-invite.js");
const SchemaTranslate = require("../models/server/translate.js");
const translate = require("@iamtraction/google-translate");
const SchemaPoll = require('../models/server/poll');
const client = require('../index');
const axios = require("axios");
const cld = require('cld');

client.on("messageCreate", async (message) => {
    if (!message.guild) return;

    // Anti-invite
    async function AntiInvite() {
        SchemaAntiInvite.findOne({ Guild: message.guild.id }, async(err, data) => {
            if (!data) return;
            if (data) {
                function deleteMessage() {
                    message.delete();
                    if (data.Message === true) message.channel.send("No advertising in this server.");
                }

                const links = ['discord.gg/', 'discordapp.com/invite', 'discord.com/invite'];

                for (const link of links) {
                    if (!message.content.includes(link)) return;

                    const code = message.content.split(link)[1].split(' ')[0];
                    const isGuildInvite = message.gui.invites.cache.has(code);

                    if (!isGuildInvite) {
                        try {
                            const vanity = await message.guild.fetchVanityData();

                            if (code !== vanity?.code) return deleteMessage();

                        } catch (err) {
                            deleteMessage();
                        }
                    }

                }
            }
        });
    }
    AntiInvite();

    // Advanced-Poll
    async function AdvancedPoll() {
        SchemaPoll.findOne({ Guild: message.guild.id }, async(err, data) => {
            if (!data) return;
            if (!data.Channels.includes(message.channel.id)) return;

            const eachLine = message.content.split('\n');

            for (const line of eachLine) {
                if (line.includes('=')) {
                    const split = line.split('=');
                    const emoji = split[0].trim();
                    message.react(emoji);
                }
            }
        });
    }
    AdvancedPoll();

    // Auto-Translate
    async function AutoTranslate() {
        if (message.author.bot) return;
        const msg = message.cleanContent;
        if (msg.length < 6 || !msg.includes(' ')) return;
        SchemaTranslate.findOne({
            Guild: message.guild.id
        }, async (err, data) => {
            if (!data) return;
            if (data) {
                const result = await cld.detect(String(msg)).catch(err => {
                    return;
                });
                if (!result || result === undefined) return;
                if (result.languages[0].percent < data.Percent) return;
                if (result.languages[0].code === data.Language) return;

                const stringContent = String(message.content);

                let translated = null;
                if (client.config.translate.type === "google") {
                    translated = await translate(stringContent, {
                        from: 'auto',
                        to: data.Language
                    });

                    if (!translated.text) return;

                    translated = {
                        text: translated.text,
                        iso: translated.from.language.iso
                    };
                } else if (client.config.translate.type === "libre") {
                    translated = (await axios.post(`${client.config.translate.url}/translate`, {
                        q: stringContent,
                        source: "auto",
                        target: data.Language
                    })).data;

                    if (!translated.translatedText) return;

                    translated = {
                        text: translated.translatedText,
                        iso: translated.detectedLanguage.translated
                    };
                }

                if (translated.iso == "en" || translated.text.toLocaleLowerCase() == stringContent.toLocaleLowerCase()) return;

                message.reply({
                    content: translated.text,
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }
        });
    }
    AutoTranslate();
});