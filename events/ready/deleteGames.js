module.exports = async(client) => {
    await require("../../models/user/fg-instance").deleteMany({});
    await require("../../models/user/snake").deleteMany({});
    await require("../../models/user/rps").deleteMany({});
    await require("../../models/user/ttt").deleteMany({});
}