const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: "weather",
  usage: "[location]",
  description: "Retrieve current weather information for a specific location.",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    if (!client.config.api.weatherapi) return message.reply("Weather CMD is not enabled.");

    const location = args.join(" ");
    if (!location) return message.reply("Please enter a location.");

    const response = await (await fetch(encodeURI(`http://api.weatherapi.com/v1/current.json?key=${client.config.api.weatherapi}&q=${location}`))).json();

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `Weather - ${response.location.name}`, iconURI: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpapirus-team%2Fpapirus-apps%2F512%2Fweather-icon.png&f=1&nofb=1" })
          .setDescription(`🌍 - ${response.location.country}\n🚩 - ${response.location.region}\n📌 - ${response.location.name}`)
          .setFields([
            { name: "Celsius - KPH", value: `Current Temp 🌡️ - ${response.current.temp_c}°C\nFeelslike🖐 - ${response.current.feelslike_c}°C\nCondition 🌦️ - ${response.current.condition.text}`, inline: true },
            { name: "Fahrenheit - MPH", value: `Current Temp 🌡️ - ${response.current.temp_f}°F\nFeelslike 🖐 - ${response.current.feelslike_f}°F\nCondition 🌦️ - ${response.current.condition.text}`, inline: true }
          ])
          .setColor("Random")
      ]
    });
  }
}
