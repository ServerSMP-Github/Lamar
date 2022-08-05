const { Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "anime",
    description: "Get Anime Actions",
    options: [
        {
            name: 'category',
            description: "which action do you want",
            required: true,
            type: "STRING",
            choices: [
                {
                    name: "cuddle",
                    value: "cuddle"
                },
                {
                    name: "hug",
                    value: "hug"
                },
                {
                    name: "kiss",
                    value: "kiss"
                },
                {
                    name: "smile",
                    value: "smile"
                },
                {
                    name: "wave",
                    value: "wave"
                },
                {
                    name: "handhold",
                    value: "handhold"
                },
                {
                    name: "wink",
                    value: "wink"
                },
                {
                    name: "poke",
                    value: "poke"
                },
                {
                    name: "dance",
                    value: "dance"
                },
                {
                    name: "cringe",
                    value: "cringe"
                },
                {
                    name: "kill",
                    value: "kill"
                },
                {
                    name: "slap",
                    value: "slap"
                },
                {
                    name: "bite",
                    value: "bite"
                },
                {
                    name: "highfive",
                    value: "highfive"
                },
                {
                    name: "blush",
                    value: "blush"
                },
                {
                    name: "pat",
                    value: "pat"
                },
                {
                    name: "smug",
                    value: "smug"
                },
                {
                    name: "bonk",
                    value: "bonk"
                },
                {
                    name: "cry",
                    value: "cry"
                },
                {
                    name: "bully",
                    value: "bully"
                },
                {
                    name: "yeet",
                    value: "yeet"
                },
                {
                    name: "happy",
                    value: "happy"
                },
                {
                    name: "kick",
                    value: "kick"
                },
            ],
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const category = args[0];

        let url = null;
        if (category === "cuddle") url = "https://api.waifu.pics/sfw/cuddle";
        else if (category === "hug") url = "https://api.waifu.pics/sfw/hug";
        else if (category === "kiss") url = "https://api.waifu.pics/sfw/kiss";
        else if (category === "smile") url = "https://api.waifu.pics/sfw/smile";
        else if (category === "wave") url = "https://api.waifu.pics/sfw/wave";
        else if (category === "handhold") url = "https://api.waifu.pics/sfw/handhold";
        else if (category === "wink") url = "https://api.waifu.pics/sfw/wink";
        else if (category === "poke") url = "https://api.waifu.pics/sfw/poke";
        else if (category === "dance") url = "https://api.waifu.pics/sfw/dance";
        else if (category === "cringe") url = "https://api.waifu.pics/sfw/cringe";
        else if (category === "kill") url = "https://api.waifu.pics/sfw/kill";
        else if (category === "slap") url = "https://api.waifu.pics/sfw/slap";
        else if (category === "bite") url = "https://api.waifu.pics/sfw/bite";
        else if (category === "highfive") url = "https://api.waifu.pics/sfw/highfive";
        else if (category === "blush") url = "https://api.waifu.pics/sfw/blush";
        else if (category === "pat") url = "https://api.waifu.pics/sfw/pat";
        else if (category === "smug") url = "https://api.waifu.pics/sfw/smug";
        else if (category === "bonk") url = "https://api.waifu.pics/sfw/bonk";
        else if (category === "cry") url = "https://api.waifu.pics/sfw/cry";
        else if (category === "bully") url = "https://api.waifu.pics/sfw/bully";
        else if (category === "yeet") url = "https://api.waifu.pics/sfw/yeet";
        else if (category === "happy") url = "https://api.waifu.pics/sfw/happy";
        else if (category === "kick") url = "https://api.waifu.pics/sfw/kick";
        else return interaction.followUp("Invalid category");

        try {
            const image = (await axios.get(url)).data.url;
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Here's a ${category} GIF`)
                        .setColor("Random")
                        .setImage(image)
                ]
            });
        } catch (e) {
            interaction.followUp({
                content: "An error occurred!"
            });
        }
    },
}