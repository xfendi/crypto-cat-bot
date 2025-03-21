const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  serverId: { type: String, required: true },
  channelId: { type: String, required: false },
  wallet: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);