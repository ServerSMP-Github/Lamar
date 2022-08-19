const { EmbedBuilder, Message, Client } = require('discord.js');
const fetch = require("axios");

module.exports = {
  name: 'weather',
  usage: '[ location ]',
  description: "Get weather information.",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!client.config.api.weatherapi) return message.reply("Weather CMD is not enabled.");
    const location = args.join(" ");
    if (!location) return message.reply("Please enter a location.");
    const response = await fetch(encodeURI(`http://api.weatherapi.com/v1/current.json?key=${client.config.api.weatherapi}&q=${location}`));
    const data = await response.data;
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: `Weather - ${data.location.name}`, iconURI: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpapirus-team%2Fpapirus-apps%2F512%2Fweather-icon.png&f=1&nofb=1" })
          .setDescription(`🌍 - ${data.location.country}\n🚩 - ${data.location.region}\n📌 - ${data.location.name}`)
          .addField("Celsius - KPH", `Current Temp 🌡️ - ${data.current.temp_c}°C\nFeelslike🖐 - ${data.current.feelslike_c}°C\nCondition 🌦️ - ${data.current.condition.text}`, true)
          .addField("Fahrenheit - MPH", `Current Temp 🌡️ - ${data.current.temp_f}°F\nFeelslike 🖐 - ${data.current.feelslike_f}°F\nCondition 🌦️ - ${data.current.condition.text}`, true)
          .setColor("Random")
      ]
    });
  }
}
