const User = require("../Schemas/User");
const { Connection, PublicKey } = require("@solana/web3.js");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

const connection = new Connection("https://api.mainnet-beta.solana.com");

module.exports = {
  name: "transactions",
  description: "Get last transactions on your account.",
  async execute(client, message, args) {
    const discordId = message.author.id;
    const { guild } = message;

    const user = await User.findOne({ discordId, serverId: guild.id });

    const walletAddress = user?.wallet;

    if (!walletAddress) {
      return message.reply(
        "`❌` You haven't set a wallet address yet! Use `!wallet <your_address>` to set one."
      );
    }

    const publicKey = new PublicKey(walletAddress);

    if (!args[0] || isNaN(args[0])) {
      return message.reply(
        "`❌` Please provide a number of transactions to fetch. Use `!transactions <number>`."
      );
    } else if (Number(args[0]) >= 20) {
      return message.reply(
        "`❌` Please provide a number of transactions lower than `20`."
      );
    }

    try {
      const transactions = await connection.getSignaturesForAddress(publicKey, {
        limit: Number(args[0]),
      });

      if (transactions.length === 0) {
        return message.reply("`🔍` Transactions not found.");
      }

      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("Transactions")
        .setDescription(`Address: \`${walletAddress}\``)
        .setFooter({
          text: config.footer_text,
          iconURL: client.user.displayAvatarURL(), // Avatar bota
        })
        .setTimestamp();

      transactions.forEach((tx, index) => {
        embed.addFields({
          name: `${tx.signature}`,
          value: `\`📌\` Status: **${
            tx.confirmationStatus
          }**\n\`🕒\` Date: <t:${Math.floor(
            tx.blockTime
          )}:R>\n\`🔗\` [View Details](https://solscan.io/tx/${tx.signature})`,
          inline: false,
        });
      });

      message.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      message.reply("`❌` Failed to fetch transactions.");
    }
  },
};
