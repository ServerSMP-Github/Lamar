const { removeColorCodes, fgRed, fgYellow, fgGreen, fgCyan, fgBlue, fgMagenta, fgWhite } = require("../console");
const fs = require('fs');

function createLogger({ filter, file }) {
    return {
        log: function ({ level, message, meta, save }) {
            save = save ? save : true; 

            let color;
            switch (level) {
                case 'error':
                    color = fgRed;
                    break;
                case 'warn':
                    color = fgYellow;
                    break;
                case 'info':
                    color = fgGreen;
                    break;
                case 'verbose':
                    color = fgCyan;
                    break;
                case 'debug':
                    color = fgBlue;
                    break;
                case 'silly':
                    color = fgMagenta;
                    break;
                default:
                    color = fgWhite;
            }

            if (!filter.includes(level)) return;

            console.log(`[${color(level)}] ${message}`, meta ? meta : "");

            if (!save) return;

            fs.appendFile(file, removeColorCodes(`[${level}] ${message} ${meta ? JSON.stringify(meta) : ''}\n`), (err) => {
                if (err) console.error(`Error writing to file: ${err}`);
            });
        }
    };
}

module.exports = {
    createLogger
}