const { GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

module.exports = (config) => {

    const fonts = config.font;
    for (let index = 0; index < fonts.length; index++) {
        const { file, name } = fonts[index];
        GlobalFonts.registerFromPath(path.join(__dirname, '..', 'assets', 'fonts', file), name);
    }

}