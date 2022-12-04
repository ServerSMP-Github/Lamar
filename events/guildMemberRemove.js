const client = require('../index');

const { promisify } = require("util");
const { glob } = require("glob");

const globPromise = promisify(glob);

client.on("guildMemberRemove", async(member) => {
    const eventFiles = await globPromise(`${process.cwd()}/events/guildMemberRemove/*.js`);
    eventFiles.map((value) => require(value)(member));
});