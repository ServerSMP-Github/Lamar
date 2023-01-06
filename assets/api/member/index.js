function boostLevel(time, client) {
    if (!time) return "";

    const duration = Date.now() - time;

    let badge = "";
    if (duration >  1000 * 60 * 60 * 24 * 30 * 24) badge = client.config.emoji.boost_level.level_9;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *18) badge = client.config.emoji.boost_level.level_8;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *15) badge = client.config.emoji.boost_level.level_7;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *12) badge = client.config.emoji.boost_level.level_6;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *9) badge = client.config.emoji.boost_level.level_5;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *6) badge = client.config.emoji.boost_level.level_4;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *3) badge = client.config.emoji.boost_level.level_3;
    else if (duration >  1000 * 60 * 60 * 24 * 30 *2) badge = client.config.emoji.boost_level.level_2;
    else badge = client.config.emoji.boost_level.level_1;

    return badge;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
    capitalizeFirstLetter,
    boostLevel
}