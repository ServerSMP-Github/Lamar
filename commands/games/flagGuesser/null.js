const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: null,
    run: async (client, message, args) => {
        const prefix = await client.prefix(message);

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("FlagGuesser - Help")
                .setDescription(`
                    \`${prefix}fg cc\`
                    > Sends your current flag.

                    \`${prefix}fg skip\`
                    > Skip the current flag.

                    \`${prefix}fg start\`
                    > Start an instance of the game.

                    \`${prefix}fg stop\`
                    > Stop an instance of the game.

                    \`${prefix}fg lb\`
                    > View the leaderboard.
                `)
                .setColor("Random")
            ]
        })
    }
}