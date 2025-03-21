const User = require("../Schemas/User");
const { Connection, PublicKey } = require("@solana/web3.js");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const config = require("../config");

const connection = new Connection("https://api.mainnet-beta.solana.com");

async function getSolanaBalance(walletAddress) {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSol = balanceLamports / 1e9;
    return balanceSol;
  } catch (e) {
    console.error(e);
    return null;
  }
}

module.exports = {
  name: "wallet",
  description: "Set or get your Solana wallet address",
  async execute(client, message, args) {
    const discordId = message.author.id;
    const { guild } = message;

    const user = await User.findOne({ discordId, serverId: guild.id });

    if (args.length === 0) {
      try {
        if (user && user.wallet) {
          const balance = await getSolanaBalance(user.wallet);

          const response = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
          );
          const price = response.data.solana.usd;

          const balandUsd = price * balance;

          if (!balance) {
            return message.reply("`❌` Failed to fetch wallet details!");
          }

          const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle("Wallet")
            .setDescription(`Address: \`$${user.wallet}\``)
            .addFields([
              {
                name: "Balance",
                value: `\`${balance.toFixed(3)}\` SOL`,
                inline: true,
              },
              {
                name: "Total Balance",
                value: `\`$${balandUsd.toFixed(3)}\` USD`,
                inline: true,
              },
            ])
            .setFooter({
              text: config.footer_text,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

          return message.reply({ embeds: [embed] });
        } else {
          return message.reply(
            "`❌` You haven't set a wallet address yet! Use `!wallet <your_address>` to set one."
          );
        }
      } catch (e) {
        console.error(e);
        return message.reply("`❌` Error fetching your wallet address.");
      }
    }

    const walletAddress = args[0];

    // Prosta walidacja adresu Solana (przykładowa, można dodać lepszą)
    if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(walletAddress)) {
      return message.reply(
        "`❌`Invalid Solana wallet address! Make sure it is correct."
      );
    }

    try {
      if (user) {
        user.wallet = walletAddress;
      } else {
        user = new User({ discordId, wallet: walletAddress });
      }

      await user.save();
      return message.reply(
        "`✅` Successfully saved wallet address! `!wallet` to see details."
      );
    } catch (e) {
      console.error(e);
      return message.reply("`❌` Error saving your wallet address.");
    }
  },
};
