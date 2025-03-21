const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  name: "price",
  description: "Fetches the current price of Solana",
  async execute(client, message, args) {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const price = response.data.solana.usd;
      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("Price")
        .setDescription(`Current Solana Price: \`$${price}\``)
        .setFooter({
          text: config.footer_text,
          iconURL: client.user.displayAvatarURL(), // Avatar bota
        })
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      message.reply("Failed to fetch Solana price! Please try again later.");
    }
  },
};
