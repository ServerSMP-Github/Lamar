module.exports = function(value, maxValue, size, emptyValue, fullValue) {
    let barArray = [];

    let fill = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
    let empty = size - fill > 0 ? size - fill : 0;

    for (let i = 1; i <= fill; i++) barArray.push(fullValue);
    for (let i = 1; i <= empty; i++) barArray.push(emptyValue);

    return barArray.join('');
}