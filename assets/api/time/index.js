const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function nth(n) {
    return [,'st','nd','rd'][n/10%10^1&&n%10]||'th';
}

function DMY(date) {
    const time = date ? new Date(date) : new Date(); 
    return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
}

function HMS(date) {
    const time = new Date(date);
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

function fromNow(date) {
    let diff = new Date() - date;
    if (diff < 1000) return 'right now';

    let sec = Math.floor(diff / 1000);
    if (sec < 60) return sec + ' sec. ago';

    let min = Math.floor(diff / 60000);
    if (min < 60) return min + ' min. ago';

    let d = new Date(date);
    d = [
        '0' + d.getDate(),
        '0' + (d.getMonth() + 1),
        '' + d.getFullYear(),
        '0' + d.getHours(),
        '0' + d.getMinutes()
    ].map(component => component.slice(-2));

    return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}

function formatedDate(date) {
    const time = new Date(date);
    return `${weekday[time.getDay()]}, ${month[time.getMonth()]}, ${time.getDate()}${nth(time.getDate())} ${time.getFullYear()}`;
}

function serverDate(date) {
    const time = new Date(date);
    return `${time.getHours()}:${time.getMinutes()} ${(time.getHours() >= 12) ? "PM" : "AM"} ${weekday[time.getDay()]} ${time.getDate()}, ${time.getFullYear()}`;
}

function YYYY(date) {
    const time = new Date(date);
    return time.getFullYear();
}

function YYYY_MM(date) {
    const time = new Date(date);
    return `${time.getFullYear()}-${time.getMonth() + 1}`;
}

function parseDuration(durationString) {
    if (durationString.includes(" ")) durationString = (durationString.split(" ")).join("");

    const [, days, hours, minutes, seconds] = durationString.match(/^(\d+d)?(\d+h)?(\d+m)?(\d+s)?$/);

    return (
        (days ? parseInt(days, 10) * 86400 : 0) +
        (hours ? parseInt(hours, 10) * 3600 : 0) +
        (minutes ? parseInt(minutes, 10) * 60 : 0) +
        (seconds ? parseInt(seconds, 10) : 0)
    ) * 1000;
}

function msToDurationString(milliseconds, { d = true, h = true, m = true, s = true } = {}) {
    const timeUnits = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
    const options = { d, h, m, s } ;
    let durationString = "";

    for (const unit in timeUnits) {
        if (options[unit] === false) continue;

        const amount = Math.floor(milliseconds / timeUnits[unit]);
        if (amount > 0) {
            durationString += `${amount}${unit} `;
            milliseconds %= timeUnits[unit];
        }
    }

    return durationString;
}

function msToS(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);

    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

module.exports = {
    msToDurationString,
    parseDuration,
    formatedDate,
    serverDate,
    fromNow,
    YYYY_MM,
    msToS,
    month,
    YYYY,
    DMY,
    HMS,
}