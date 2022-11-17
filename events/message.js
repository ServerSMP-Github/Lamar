const client = require('../index');

const { promisify } = require("util");
const { glob } = require("glob");

const globPromise = promisify(glob);

client.on("messageCreate", async(message) => {
    const eventFiles = await globPromise(`${process.cwd()}/events/messageCreate/*.js`);
    eventFiles.map((value) => require(value)(message));
});