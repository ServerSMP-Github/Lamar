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

function getWebsite(client) {
    let domain;
    let url;

    try {
        const domainUrl = new URL(client.config.dashboard.domain);
        domain = {
            host: domainUrl.hostname,
            protocol: domainUrl.protocol,
        };
    } catch (e) {
        console.error(e);
        return null;
    }

    if (client.config.dashboard.customDomain) url = `${domain.protocol}//${domain.host}`;
    else url = `${domain.protocol}//${domain.host}${client.config.dashboard.port == 80 ? "" : `:${client.config.dashboard.port}`}`;

    return url;
}

module.exports = {
    isValidHttpUrl,
    isImageUrl,
    getWebsite
}