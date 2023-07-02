function isStringAccurate(string1, string2, accuracyPercentage) {
    if (accuracyPercentage < 0 || accuracyPercentage > 100) throw new Error("Accuracy percentage must be between 0 and 100.");

    const minLength = Math.min(string1.length, string2.length);
    const threshold = minLength * (accuracyPercentage / 100);

    let matchingCount = 0;
    for (let i = 0; i < minLength; i++) {
        if (string1[i] === string2[i]) matchingCount++;
    }

    return matchingCount >= threshold;
}

function cleanText(text) {
    return text.replace(/[^\w\s]/gi, '');
}

module.exports = {
    isStringAccurate,
    cleanText
}