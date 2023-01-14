const config = require("../settings/settings.json");
const colors = require("../assets/api/console");
const { spawn } = require('child_process');

if (config.music.enabled === false || config.music.server.enabled === false) return;

const child = spawn("java", ["-jar", `${process.cwd()}/lavalink/app/Lavalink.jar`], { cwd: `${process.cwd()}/lavalink/app` });

child.stdout.on('data', (data) => {
    const stringData = data.toString();

    if (config.music.server.debug) console.log(stringData);

    if (stringData.includes("Lavalink is ready to accept connections.")) return global.lavalinkServer.success = `${colors.fgWhite("Lavalink Server:")} ${colors.fgGreen("√")}`;
    else global.lavalinkServer.success = `${colors.fgWhite("Lavalink Server:")} ${colors.fgBlue("?")}`;

    if (global.lavalinkServer.check) stringData.includes("Lavalink is ready to accept connections.") ? console.log(global.lavalinkServer.success) : null;
});

child.on('close', (code) => {
    if (global.lavalinkServer.check) console.log(`${colors.fgWhite("Lavalink Server:")} ${colors.fgRed("×")} ${colors.fgGray(`(${code})`)}`);
    else global.lavalinkServer.error = `${colors.fgWhite("Lavalink Server:")} ${colors.fgRed("×")} ${colors.fgGray(`(${code})`)}`;
});