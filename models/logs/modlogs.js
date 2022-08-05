const { Schema, model } = require('mongoose');

module.exports = model('modlogs', new Schema({
    Guild: String,
    Channel: String,
    chc: Boolean,
    chd: Boolean,
    chpu: Boolean,
    chu: Boolean,
    ed: Boolean,
    ec: Boolean,
    eu: Boolean,
    gba: Boolean,
    gbr: Boolean,
    gma: Boolean,
    gmr: Boolean,
    gmc: Boolean,
    gmu: Boolean,
    rc: Boolean,
    rd: Boolean,
    ru: Boolean,
    ivc: Boolean,
    ivd: Boolean,
    md: Boolean,
    mu: Boolean,
}));
