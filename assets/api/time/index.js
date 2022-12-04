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

module.exports = {
    DMY,
    HMS,
    YYYY,
    YYYY_MM,
    fromNow,
    formatedDate,
    serverDate
}