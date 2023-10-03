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

async function isImageUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD', mode: 'cors', cache: 'no-store' });
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.startsWith('image/')) return true;
        else return false;
    } catch (error) {
        console.error(error);
        throw error;
    }
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