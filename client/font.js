const { GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

module.exports = () => {

    GlobalFonts.registerFromPath(path.join(__dirname, '..', 'assets', 'fonts', 'arial.woff'), 'Arial');
    GlobalFonts.registerFromPath(path.join(__dirname, '..', 'assets', 'fonts', 'amaranth.woff2'), 'Amaranth');

}