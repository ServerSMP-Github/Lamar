// Progressbar functions
module.exports.progressBar = function(value, maxValue, size, client) {
  let barArray = [];

  let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
  let empty = size - fill > 0 ? size - fill : 0;

  for (let i = 1; i <= fill; i++) barArray.push(client.config.emoji.progressbar.fill.bar);
  for (let i = 1; i <= empty; i++) barArray.push(client.config.emoji.progressbar.empty.bar);

  barArray[0] = barArray[0] == client.config.emoji.progressbar.fill.bar ? client.config.emoji.progressbar.fill.start : client.config.emoji.progressbar.empty.start;
  barArray[barArray.length -1] = barArray[barArray.length -1] == client.config.emoji.progressbar.fill.bar ? client.config.emoji.progressbar.fill.end : client.config.emoji.progressbar.empty.end;

  return barArray.join(``);
}

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
