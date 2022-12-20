function cleanText(text) {
    return text.replace(/[^\w\s]/gi, '');
}

module.exports = {
    cleanText
}