const User = require("../Schemas/User");

module.exports = {
  name: "copy-setup",
  description: "Setup your copy trading configuration",
  async execute(client, message, args) {
    const discordId = message.author.id;
    const { guild } = message;

    const user = await User.findOne({ discordId, serverId: guild.id });

    if (args.length === 0) {
      try {
        return message.reply(
          "`❌` Please enter wallet you want to copy from and copy percentage."
        );
      } catch (e) {
        console.error(e);
        return message.reply("`❌` Error fetching your wallet address.");
      }
    } else if (!args[1] || isNaN(args[1])) {
      return message.reply(
        "`❌` Please provide a valid copy percentage number. Use `!copy-setup <wallet> <number>`."
      );
    }

    const walletAddress = args[0];
    const copyPercentage = parseInt(args[1]);

    // Prosta walidacja adresu Solana (przykładowa, można dodać lepszą)
    if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(walletAddress)) {
      return message.reply(
        "`❌` Invalid Solana wallet address! Make sure it is correct."
      );
    }

    try {
      user.copyWallet = walletAddress;
      user.copyPercentage = copyPercentage;

      await user.save();
      return message.reply(
        "`✅` Successfully saved copy trade wallet address and copy percentage! `!copy` to see details."
      );
    } catch (e) {
      console.error(e);
      return message.reply(
        "`❌` Error saving copy trade wallet address and copy percentage."
      );
    }
  },
};
