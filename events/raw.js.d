const client = require("../index");

client.on("raw", async (data) => client.music.updateVoiceState(data));
