const { Schema, model } = require('mongoose');

module.exports = model('api-guild-stats', new Schema({
    Guild: String,
    Messages: Number,
    MessagesDelete: Number,
    MessagesEdit: Number,
    ChannelCreate: Array,
    ChannelDelete: Array,
    ChannelPinUpdate: Array,
    ChannelUpdate: Array,
    EmojiCreate: Array,
    EmojiDelete: Array,
    EmojiUpdate: Array,
    BanAdd: Array,
    BanRemove: Array,
    MemberAdd: Array,
    MemberRemove: Array,
    MemberUpdate: Array,
}));