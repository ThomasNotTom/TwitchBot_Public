const UserManager = require("../Managers/UserManager");

var TheBoom_Bot = null

const REWARDS = {
    "points+10": "6357577c-cba2-4501-8ea8-1b806f775c30",
    "points+50": "7d9252e2-9a98-4d16-9a6a-de9ee3d7d8c2"
}

module.exports = class RewardHandler {
    static init(BOT) {
        TheBoom_Bot = BOT
    }
    static handle(username, rewardID) {
        switch (rewardID) {
            case REWARDS["points+10"]:
                UserManager.addUserPoints(username, 10)
                break

            case REWARDS["points+50"]:
                UserManager.addUserPoints(username, 50)
                break
        }
    }
    static handleText(channel, tags, message) {
        switch (tags["custom-reward-id"]) {
            case "":
                console.log("placeholder")
                break
        }
    }
}