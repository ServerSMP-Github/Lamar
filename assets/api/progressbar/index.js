module.exports = function(client, value, maxValue, size, emptyValue, fullValue, emoji) {
    if (emoji) {
        emptyValue = client.config.emoji.progressbar.empty.bar;
        fullValue = client.config.emoji.progressbar.fill.bar;
    }

    let barArray = [];

    let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    let empty = size - fill > 0 ? size - fill : 0;

    for (let i = 1; i <= fill; i++) barArray.push(fullValue);
    for (let i = 1; i <= empty; i++) barArray.push(emptyValue);

    if (emoji) {
        barArray[0] = barArray[0] == client.config.emoji.progressbar.fill.bar ? client.config.emoji.progressbar.fill.start : client.config.emoji.progressbar.empty.start;
        barArray[barArray.length -1] = barArray[barArray.length -1] == client.config.emoji.progressbar.fill.bar ? client.config.emoji.progressbar.fill.end : client.config.emoji.progressbar.empty.end;
    }

    return barArray.join('');
}