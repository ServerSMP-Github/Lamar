const { Schema, model } = require('mongoose');

module.exports = model('user-stats', new Schema({
  CmdUsed: Number,
  User: String,
}));
