const profileSchema = require("../../models/user/profile");
const { getRandom } = require("../../assets/api/crypto");
const client = require("../../index");

module.exports = async(message) => {
    if (!message.guild || message.author.bot) return;

    let profileData = await profileSchema.findOne({ User: message.author.id });

    if (!profileData) profileData = await profileSchema.create({
        User: message.author.id,
        Name: message.author.username,
        Description: "",
        Status: "",
        Statustype: "auto",
        Descriminator: String(message.author.discriminator),
        Background: "minecraft",
        Owner: false,
        Level: 0,
        XP: 0,
        MaxXP: 0,
    });

    const randomXp = Math.floor(getRandom() * 5) + 1;

    if (profileData.Level === 0 && profileData.XP === 0) profileData.XP = Number(profileData.XP) + 10;
    else profileData.XP = Number(profileData.XP) + randomXp;

    if (profileData.MaxXP === 0) profileData.MaxXP = Number(profileData.XP) * 5;

    if (profileData.XP >= profileData.MaxXP) {
        profileData.Level = Number(profileData.Level) + 1;
        profileData.XP = 0;
        profileData.MaxXP = Number(profileData.MaxXP) * 5;
    }

    await profileData.save();
}