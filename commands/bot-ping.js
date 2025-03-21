const { EmbedBuilder } = require("discord.js");
const config_file = require("../config");

module.exports = {
  name: "bot-ping",
  description: "Check bot status",
  async execute(client, message, args) {
    const ping = client.ws.ping;
    const embed = new EmbedBuilder()
      .setColor(config_file.color)
      .setTitle("Ping")
      .setDescription(`Latency: \`${ping}ms\``)
      .setFooter({
        text: config_file.footer_text,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await message.channel.send({
      embeds: [embed],
    });
  },
};
