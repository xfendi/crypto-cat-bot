const User = require("../Schemas/User");

function isValidSecretKey(secretKey) {
  return /^([1-9A-HJ-NP-Za-km-z]{43,88})$/.test(secretKey);
}

module.exports = {
  name: "secret",
  description: "Set a secret key for copy trading",
  async execute(client, message, args) {
    const discordId = message.author.id;
    const { guild } = message;
    const user = await User.findOne({ discordId, serverId: guild.id });
    const secretKey = args[0];

    if (args.length === 0) {
      return message.reply("`❌` Please provide a secret key.");
    } else if (!isValidSecretKey(secretKey)) {
      return message.reply(
        "`❌` Invalid Solana secret key! Make sure it is correct."
      );
    }

    try {
      if (user) {
        user.secretKey = secretKey;
      } else {
        return message.reply("`❌` User setup not found!");
      }

      await user.save();

      return message.reply(
        "`✅` Successfully saved secret key for copy trading!"
      );
    } catch (e) {
      console.error(e);
      return message.reply("`❌` Error saving your secret key.");
    }
  },
};
