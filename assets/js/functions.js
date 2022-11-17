// Sharding functions
module.exports.guilds = function(client) {
  client.shard.fetchClientValues('guilds.cache.size').then(results => {
      return results.reduce((prev, val) => prev + val, 0);
  });
}

module.exports.channels = function(client) {
  client.shard.fetchClientValues('channels.cache.size').then(results => {
      return results.reduce((prev, val) => prev + val, 0);
  });
}

module.exports.users = function(client) {
  client.shard.fetchClientValues('users.cache.size').then(results => {
      return results.reduce((prev, val) => prev + val, 0);
  });
}

module.exports.emoji = function(client) {
  function findEmoji(c, { nameOrId }) {
      return c.emojis.cache.get(nameOrId) || c.emojis.cache.find(e => e.name.toLowerCase() === nameOrId.toLowerCase());
  }

  client.shard.broadcastEval(findEmoji, { context: { nameOrId: emojiNameOrId } }).then(results => {
      return results
  });
}

module.exports.getGuild = async (client, guildId) => {
  let guilds = await client.shard.broadcastEval(
    (c, ctx) => {
      let guild = c.guilds.cache.get(ctx) || c.guilds.fetch(ctx);
      if (guild) {
        return guild;
      } else {
        return null;
      }
    },
    { context: guildId }
  );
  for (let i = 0; i < guilds.length; i++) {
    if (guilds[i]) return guilds[i];
  }
};
