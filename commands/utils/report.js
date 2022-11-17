const { EmbedBuilder, Message, Client, WebhookClient } = require("discord.js");

module.exports = {
    name: "report",
    usage: "[ bug ]",
    description : "Report a bug to the owner of the bot.",
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async(client, message, args) => {
        const query = args.join(" ");
        if (!query) return message.reply("Please specify the bug.");

        if (!client.config.channel.webhooks.report) return message.reply({ content: "This feature is disabled." });

        new WebhookClient({ url: client.config.channel.webhooks.report }).send({
            embeds: [
                new EmbedBuilder()
                .setTitle("New BUG!")
                .addField("Author", message.author.toString(), true)
                .addField("Guild", message.guild.name, true)
                .addField("Report", query)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            ]
        });

        message.channel.send("Report has been sent!");
    }
}
