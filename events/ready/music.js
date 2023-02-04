module.exports = async (client) => {
    if (client.config.music.enabled) client.poru.init(client);
}