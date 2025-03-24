const { EmbedBuilder } = require("discord.js");
const config_file = require("../config");
const User = require("../Schemas/User");

module.exports = {
  name: "copy",
  description: "Check your copy trade configuration",
  async execute(client, message, args) {
    const discordId = message.author.id;
    const { guild } = message;

    const user = await User.findOne({ discordId, serverId: guild.id });

    const embed = new EmbedBuilder()
      .setColor(config_file.color)
      .setTitle("Copy Trading")
      .setDescription(`Wallet: \`${user.copyWallet}\``)
      .addFields([
        {
          name: "Enabled",
          value: `\`${user.copyTrading ? "True" : "False"}\``,
          inline: true,
        },
        {
          name: "Copy Percentage",
          value: `\`${user.copyPercentage}\`%`,
          inline: true,
        },
      ])
      .setFooter({
        text: config_file.footer_text,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await message.reply({
      embeds: [embed],
    });
  },
};
