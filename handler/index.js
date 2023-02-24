const { Client, ApplicationCommandType } = require("discord.js");
const customCommandModel = require("../models/server/cc-slash");
const { getFileList } = require("../assets/api/file");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await getFileList(`${process.cwd()}/commands`, { type: ".js", recursively: true, maxDepth: 1 });
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await getFileList(`${process.cwd()}/events`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await getFileList(`${process.cwd()}/SlashCommands`, { type: ".js", recursively: true });

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if ([ApplicationCommandType.Message, ApplicationCommandType.User].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        // Register for a single guild
        // await client.guilds.cache
        //    .get("831513803488624730")
        //    .commands.set(arrayOfSlashCommands);

        // Register for all the guilds the bot is in
        await client.application.commands.set(arrayOfSlashCommands);

        customCommandModel.find().then(data => {
          data.forEach((cmd) => {
            const guild = client.guilds.cache.get(cmd.guildId);
            guild?.commands.create({
              name: cmd.commandName,
              description: "a custom command",
            });
          });
        });
    });

};
