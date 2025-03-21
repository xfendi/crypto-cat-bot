const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const config = require("./config");

const {
  TOKEN,
  GUILD_ID,
  ACTIVITY_ROLE_ID,
  SPECIAL_CHANNEL_ID,
  SPECIAL_ROLE_ID,
  NOTIFICATIONS_ROLE_ID,
  CHANNEL_ID,
  MONGO_DB,
} = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: "Crypto Activities!", type: 0 }], // Type 0 = "Playing"
    status: "idle", // "online" | "idle" | "dnd" | "invisible"
  });

  mongoose
    .connect(MONGO_DB)
    .then(() => {
      console.log("🎓 Connected to MongoDB!");
    })
    .catch((err) => {
      console.error("❌ Error connecting to MongoDB:", err);
    });
});

client.commands = new Map();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);
  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(TOKEN);
