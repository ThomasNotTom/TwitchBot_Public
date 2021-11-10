const UserManager = require("../Managers/UserManager");

var TheBoom_Bot = null

module.exports = class RewardHandler {
    static init(BOT) {
        TheBoom_Bot = BOT
    }

    static handle(channel, tags, message) {
        const anonymous = tags["username"] === "ananonymouscheerer"
        const bitSuffix = ((tags["bits"] === "1") ? "bit" : "bits")
        if (!anonymous) {
            UserManager.addUserPoints(tags["username"], tags["bits"] * 20)
            TheBoom_Bot.say(`TwitchLit Thank you ${tags["username"]}, for donating ${tags["bits"]} ${bitSuffix} TwitchLit`)
        } else {
            TheBoom_Bot.say(`TwitchLit Thank you for the anonymous donation of ${tags["bits"]} ${bitSuffix} TwitchLit`)
        }
    }
}