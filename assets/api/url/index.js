const https = require('https');
const http = require('http');

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function isImageUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;

        client
            .get(url, (response) => {
                if (response.headers['content-type'].startsWith('image/')) resolve(true);
                else resolve(false);
            })
            .on('error', () => reject(false));
    });
}

module.exports = {
    isValidHttpUrl,
    isImageUrl
}