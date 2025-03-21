const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  name: "help",
  description: "Displays help information about every command",
  async execute(client, message, args) {
    const fields = [];

    client.commands.forEach((command) => {
      fields.push({
        name: `**${command.name}**`, // Nazwa komendy
        value: command.description, // Opis komendy
      });
    });

    if (fields.length === 0) {
      return message.reply("There is no available commands!");
    }

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle("Bot Commands")
      .setDescription(`Current Bot Prefix: \`${config.prefix}\``)
      .addFields(fields) // Dodanie pól z komendami
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: config.footer_text,
        iconURL: client.user.displayAvatarURL(), // Avatar bota
      })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
