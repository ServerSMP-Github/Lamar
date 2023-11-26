const { EmbedBuilder, Events } = require('discord.js');
const Schema = require('../models/logs/modlogs');
const client = require("../index");

client.on(Events.ChannelCreate, async (channel) => {
  const data = await Schema.findOne({
    Guild: channel.guild.id
  }).exec();
  if (!data) return;
  if (data.chc === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(":white_circle: Channel Created :white_circle: ")
      .setColor("Yellow")
      .setDescription(`**Channel Name:** \`${channel.name}\`\n**Channel ID:** \`${channel.id}\`\n**Channel Type:** \`${channel.type}\``)
      .setTimestamp()
    ]
  });
});

client.on(Events.ChannelPinsUpdate, async (channel, time) => {
  const data = await Schema.findOne({
    Guild: channel.guild.id
  }).exec();
  if (!data) return;
  if (data.chpu === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(":safety_pin: Channel Pin Updated :safety_pin:")
      .setColor("Yellow")
      .setDescription(`**Channel Name:** \`${channel.name}\`\n**Channel ID:** \`${channel.id}\`\n**Pinned at** \`${time}\``)
      .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/pushpin_1f4cc.png")
      .setTimestamp()
    ]
  });
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
  const data = await Schema.findOne({
    Guild: oldChannel.guild.id
  }).exec();
  if (!data) return;
  if (data.chu === true) return;
  if (!newChannel.guild || !newChannel.guild.available) return;

  const channel = client.channels.cache.get(data.Channel);

  let types = {
    text: "Text Channel",
    voice: "Voice Channel",
    null: "No Type",
    news: "News Channel",
    store: "Store Channel",
    category: "Category",
  };

  if (oldChannel.name != newChannel.name) {
    channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(":white_circle: Channel Updated - Name :white_circle:")
        .setColor("Yellow")
        .setDescription(`**Channel Name:** \`${oldChannel.name}\`\nChannel ID: \`${oldChannel.id}\`\n\n` + `**Channel Name:** \`${newChannel.name}\`\nChannel ID: \`${newChannel.id}\``)
        .setTimestamp()
        .setFooter({ text: "You cant hide anything from us :)" })
      ]
    });
  } else if (oldChannel.type != newChannel.type) {
    channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(":white_circle: Channel Updated - Type :white_circle:")
        .setColor("Yellow")
        .setDescription(`**Channel Name:** \`${oldChannel.name}\`\nChannel ID: \`${oldChannel.id}\`\n**Channel Type:** \`${types[oldChannel.type]}\`\n\n` + `**ChannelNAME:** \`${newChannel.name}\`\nChannel ID: \`${newChannel.id}\`\n**Channel Type:** \`${types[newChannel.type]}\``)
        .setFooter({ text: "You cant hide anything from us :)" })
        .setTimestamp()
      ]
    });
  } else if (oldChannel.topic != newChannel.topic) {
    channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(":white_circle: Channel Updated - Topic :white_circle:")
        .setColor("Yellow")
        .setDescription(`**Channel Name:** \`${oldChannel.name}\`\n**Channel ID:** \`${oldChannel.id}\`\n**Channel Topic:** \`${oldChannel.topic}\`\n\n` + `**Channel Name:** \`${newChannel.name}\`\n**Channel ID:** \`${newChannel.id}\`\n**Channel Topic:** \`${newChannel.topic}\``)
        .setFooter({ text: "You cant hide anything from us :)" })
        .setTimestamp()
      ]
    });
  } else if (oldChannel.parent !== newChannel.parent) {
    channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(`:white_circle: Channel Category Updated :white_circle:`)
        .addFields(
          { name: "Channel", value: oldChannel },
          { name: "Old Category", value: `${oldChannel.parent} seconds` },
          { name: "New Category", value: `${newChannel.parent} seconds` }
        )
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: "You cant hide anything from us :)" })
      ]
    });
  } else if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
    channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(`:white_circle: Channel Slowmode Updated :white_circle:`)
        .addFields(
          { name: "Channel", value: oldChannel },
          { name: "Old Slowmode", value: `${oldChannel.rateLimitPerUser} seconds` },
          { name: "New Slowmode", value: `${newChannel.rateLimitPerUser} seconds` }
        )
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: "You cant hide anything from us :)" })
      ]
    });
  }
});

client.on(Events.GuildEmojiDelete, async (emoji) => {
  const data = await Schema.findOne({
    Guild: emoji.guild.id
  }).exec();
  if (!data) return;
  if (data.ed === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle("❌ Emoji Deleted ❌")
      .setColor("Red")
      .setDescription(`**Emoji:** ${emoji}\n**Emoji Name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Emoji URL:** ${emoji.url}`)
      .setFooter({ text: "Nice try but you got caught" })
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildEmojiCreate, async (emoji) => {
  const data = await Schema.findOne({
    Guild: emoji.guild.id
  }).exec();
  if (!data) return;
  if (data.ec === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(":white_circle: Emoji Created :white_circle:")
      .setColor("Green")
      .setDescription(`**Emoji:** ${emoji}\n**Emoji Name:** ${emoji.name}\n**Emoji ID:** ${emoji.id}\n**Emoji URL:** ${emoji.url}`)
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildEmojiUpdate, async (olEemoji, newEmoji) => {
  const data = await Schema.findOne({
    Guild: olEemoji.guild.id
  }).exec();
  if (!data) return;
  if (data.eu === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(":new: Emoji Name Changed :new:")
      .setColor("Orange")
      .setDescription(`**Emoji: ${newEmoji}** \n\n**Before:** \`${oldEmoji.name}\`\n**After:** \`${newEmoji.name}\`\n**Emoji ID:** \`${newEmoji.id}\``)
      .setFooter({ text: "Nice try but you got caught" })
      .setTimestamp()
    ]
  });
});

// client.on("guildUpdate", async (oldGuild, newGuild) => {
//   const data = await Schema.findOne({
//     Guild: oldGuild.id
//   }).exec();
//   if (!data) return;
//   if (data.gu === true) return;
//   client.channels.cache.get(data.Channel).send({
//     embeds: [
//       new EmbedBuilder()
//       .setTitle(":white_circle: Guild Updated :white_circle:")
//       .setColor("Yellow")
//       .setDescription(`**Before:** \`${oldGuild.name}\`\n**After:** \`${newGuild.name}\`\n**Before:** \`${oldGuild.region}\`\n**After:** \`${newGuild.region}\``)
//       .setFooter({ text: "Nice try but you got caught" })
//       .setTimestamp()
//     ]
//   });
// });

// client.on("guildMemberKick", async (member) => {
//   const data = await Schema.findOne({
//     Guild: member.guild.id
//   }).exec();
//   if (!data) return;
//   if (data.gmk === true) return;
//   client.channels.cache.get(data.Channel).send({
//     embeds: [
//       new EmbedBuilder()
//       .setTitle(":white_circle: Member Kicked :white_circle:")
//       .setColor("Red")
//       .setDescription(`**Member:** ${member}\n**Member ID:** ${member.id}`)
//       .setFooter({ text: "Must of been a genshin user" })
//       .setTimestamp()
//     ]
//   });
// });

client.on(Events.GuildBanAdd, async (ban) => {
  const data = await Schema.findOne({
    Guild: ban.guild.id
  }).exec();
  if (!data) return;
  if (data.gba === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle("🔨User Banned🔨")
      .setColor("Red")
      .setDescription(`**User:** ${ban.user.username} (\`${ban.user.id}\`)\n**Is Bot: **${ban.user.bot}`)
      .setFooter({ text: "Looks like someone got banned :eyes:" })
      .setThumbnail(ban.user.displayAvatarURL({
        dynamic: true
      }))
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildBanRemove, async (ban) => {
  const data = await Schema.findOne({
    Guild: ban.guild.id
  }).exec();
  if (!data) return;
  if (data.gbr === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle("🔨User Unbanned🔨")
      .setColor("Yellow")
      .setDescription(`**User:** ${ban.user.username} (\`${ban.user.id}\`)\n**Is Bot: ** ${ban.user.bot}`)
      .setFooter({ text: "owo user got unbanned..." })
      .setThumbnail(ban.user.displayAvatarURL({
        dynamic: true
      }))
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildMembersChunk, async (members, guild) => {
  const data = await Schema.findOne({
    Guild: members.guild.id
  }).exec();
  if (!data) return;
  if (data.gmc === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(" :new: Member Chunk / Raid - " + members.length + "Members :new: ")
      .setColor("Red")
      .setDescription(members.map((user, index) => `${index}) - ${user} - ${user.username} - \`${user.id}\``))
      .setFooter({ text: "Sad this is a raid" })
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const data = await Schema.findOne({
    Guild: oldMember.guild.id
  }).exec();
  if (!data) return;
  if (data.gmu === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(`:new: Member Role Changed :new: `)
      .addFields(
        { name: "**Member**", value: oldMember },
        { name: "**Before**", value: oldMember.roles.cache.map((role) => role.toString()).join(" , ") },
        { name: "**After**", value: newMember.roles.cache.map((role) => role.toString()).join(" , ") }
      )
      .setFooter({ text: "new roles! yay" })
      .setColor("Yellow")
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildRoleCreate, async (role) => {
  const data = await Schema.findOne({
    Guild: role.guild.id
  }).exec();
  if (!data) return;
  if (data.rc === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(`✔ Role Created ✔`)
      .setColor("Green")
      .addFields(
        { name: "Role", value: role },
        { name: "Position", value: role.position },
        { name: "ID", value: role.id }
      )
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildRoleDelete, async (role) => {
  const data = await Schema.findOne({
    Guild: role.guild.id
  }).exec();
  if (!data) return;
  if (data.rd === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(`🗑️ Role Deleted 🗑️`)
      .setColor("Red")
      .addFields(
        { name: "Role", value: role.name },
        { name: "Position", value: role.position },
        { name: "ID", value: role.id }
      )
      .setTimestamp()
    ]
  });
});

client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
  const data = await Schema.findOne({
    Guild: oldRole.guild.id
  }).exec();
  if (!data) return;
  if (data.ru === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(`:new: Role Name Updated :new:`)
      .addFields(
        { name: "Role", value: oldRole },
        { name: "Old Name", value: oldRole.name },
        { name: "New Name", value: newRole.name }
      )
      .setColor("Yellow")
      .setTimestamp()
    ]
  });
});

client.on(Events.InviteCreate, async (invite) => {
  const data = await Schema.findOne({
    Guild: invite.guild.id
  }).exec();
  if (!data) return;
  if (data.ic === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(`✔ Invite Created ✔`)
      .setColor("Green")
      .addFields({ name: "Invite", value: invite })
      .setTimestamp()
    ]
  });
});

client.on(Events.InviteDelete, async (invite) => {
  const data = await Schema.findOne({
    Guild: invite.guild.id
  }).exec();
  if (!data) return;
  if (data.id === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(`🗑️ Invite Deleted 🗑️`)
      .setColor("Red")
      .addFields({ name: "Invite", value: invite })
      .setTimestamp()
    ]
  });
});

client.on(Events.MessageDelete, async (message) => {
  const data = await Schema.findOne({
    Guild: message.guild.id
  }).exec();
  if (!data) return;
  if (data.md === true) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle("🗑️ Message Deleted 🗑️")
      .setDescription(`Message Just got deleted in <#${message.channel.id}> | Message by **${message.author.username}**\nAuthor ID: \`${message.author.id}\` | Message ID: \`${message.id}\` \n\n__Message__: *${message.content || "*Sorry, We cant fetch that message !*"}*`)
      .setColor("Red")
      .setThumbnail(message.author.displayAvatarURL({ size: 2048, dynamic: true }))
      .setFooter({ text: "Stop hiding da truth !!" })
      .setTimestamp()
    ]
  });
});

// client.on("messageDeleteBulk", async (messages) => {
//   const data = await Schema.findOne({
//     Guild: messages.guild.id
//   }).exec();
//   if (!data) return;
//   if (data.mdb === true) return;
//   client.channels.cache.get(data.Channel).send({
//     embeds: [
//       new EmbedBuilder()
//       .setTitle("🗑️ Bulk Messages Deleted 🗑️")
//       .setDescription(`Messages Just got deleted in <#${messages.channel.id}> | Messages by **${messages.map((message) => message.author.username).join(" , ")}**\nAuthor ID: \`${messages.map((message) => message.author.id).join(" , ")}\` | Message ID: \`${messages.map((message) => message.id).join(" , ")}\` \n\n__Message__: *${messages.map((message) => message.content || "*Sorry, We cant fetch that message !*").join(" , ")}*`)
//       .setColor("Red")
//       .setThumbnail(messages.author.displayAvatarURL({ size: 2048, dynamic: true }))
//       .setFooter({ text: "Stop removing history !!" })
//       .setTimestamp()
//     ]
//   });
// }

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  const data = await Schema.findOne({
    Guild: oldMessage.guild.id
  }).exec();
  if (!data) return;
  if (data.mu === true) return;
  if (oldMessage.content === newMessage.content) return;
  client.channels.cache.get(data.Channel).send({
    embeds: [
      new EmbedBuilder()
      .setTitle(" :new: Message Updated :new:")
      .setTimestamp()
      .setColor("Yellow")
      .addFields(
        { name: "Old Content", value: `${oldMessage.content ? oldMessage.content : "*Sorry, We cant fetch that message !*"}` },
        { name: "New Content", value: `${newMessage.content ? newMessage.content : "*Sorry, We cant fetch that message !*"}` },
        { name: "Author", value: `${oldMessage.author.username}` },
        { name: "Channel", value: `<#${oldMessage.channel.id}>` }
      )
    ]
  });
});