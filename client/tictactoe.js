const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const tttSchema = require("../models/user/ttt.js");

async function newGame(message, opponent) {

    let msg = null;

    const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true }) })
        .setTitle("Trivia")

    async function event() {

    }

    async function run() {

    }

    run()

}

module.exports = { newGame }; 