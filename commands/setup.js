const User = require("../Schemas/User");
const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "setup",
  description: "Creates a private trading channel for you",
  async execute(client, message, args) {
    if (!message.guild) {
      return message.reply("`❌` This command can only be used in a server.");
    }
  
    const { guild, author } = message;
    const categoryName = "Crypto Cat"; // Nazwa kategorii
    const userId = author.id;
    const userName = author.username;

    // Sprawdzamy, czy użytkownik już ma kanał
    let existingUser = await User.findOne({
      discordId: userId,
      serverId: guild.id,
    });

    const existingChannel = guild.channels.cache.get(existingUser?.channelId);

    if (existingUser && existingChannel) {
      return message.reply(
        `\`❌\` You already have a setup! Your channel: <#${existingUser.channelId}>`
      );
    } else if (existingUser && !existingChannel) {
      await User.updateOne(
        { discordId: userId, serverId: guild.id },
        { $set: { channelId: null } }
      );
    } else if (!existingUser) {
      const newUser = await new User({
        discordId: userId,
        serverId: guild.id,
      });

      await newUser.save();
    }

    // Sprawdzamy, czy istnieje kategoria
    let category = guild.channels.cache.find(
      (ch) => ch.name === categoryName && ch.type === 4
    ); // 4 = CATEGORY

    const createChannel = async () => {
      if (!category) {
        category = await guild.channels.create({
          name: categoryName,
          type: ChannelType.GuildCategory,
        });
      }

      // Tworzymy kanał w kategorii
      const channel = await guild.channels.create({
        name: userName,
        topic: userId,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.id, // Everyone
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: userId, // Użytkownik
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      return channel;
    };

    const createdChannel = await createChannel();

    await User.updateOne(
      { discordId: userId, serverId: guild.id },
      { $set: { channelId: createdChannel.id } }
    );

    message.reply(
      `\`✅\` Successfully completed setup! Your private channel: <#${createdChannel.id}>`
    );
  },
};
