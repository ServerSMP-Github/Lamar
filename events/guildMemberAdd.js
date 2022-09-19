const client = require('../index');

const { promisify } = require("util");
const { glob } = require("glob");

const globPromise = promisify(glob);

client.on("guildMemberAdd", async(member) => {
    const eventFiles = await globPromise(`${process.cwd()}/events/guildMemberAdd/*.js`);
    eventFiles.map((value) => require(value)(member));
});