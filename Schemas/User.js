const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  serverId: { type: String, required: true },
  channelId: { type: String, required: false },
  wallet: { type: String, required: false },
  secretKey: { type: String, required: false },
  copyTrading: { type: Boolean, required: false },
  copyPercentage: { type: Number, default: 10 },
  copyWallet: { type: String },
});

module.exports = mongoose.model('User', userSchema);