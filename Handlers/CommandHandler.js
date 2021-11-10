const PointsManager = require("../Managers/UserManager")
const UserManager = require("../Managers/UserManager");

var TheBoom_Bot = null

var COMMAND_TIMEOUTS = {
    "leaderboard": false
}

module.exports = class CommandHandler {
    static init(BOT) {
        TheBoom_Bot = BOT
    }

    static handle(channel, tags, message) {
        const messages = message.split(" ")
        var isCommand = false
        if (messages[0][0] === "!") {
            messages[0] = messages[0].substring(1)
            isCommand = true
        }
        if (isCommand) {
            switch (messages[0].toLowerCase()) {
                case "hey":
                case "hi":
                case "hello":
                    messages[1] === undefined ? TheBoom_Bot.say(`Hello, ${tags["username"]}. My name is ${TheBoom_Bot.getName()}`)
                        : TheBoom_Bot.say(`Hello, ${messages[1]}. My name is ${TheBoom_Bot.getName()}`)
                    break

                case "bye":
                case "googbye":
                    messages[1] === undefined ? TheBoom_Bot.say(`Goodbye, ${tags["username"]}`)
                        : TheBoom_Bot.say(`Goodbye, ${messages[1]}`)
                    break

                case "disc":
                case "discord":
                    TheBoom_Bot.say(`Discord server: https://discord.gg/erbtNWU3pE`)
                    break

                case "youtube":
                case "yt":
                    TheBoom_Bot.say(`YouTube channel: https://www.youtube.com/channel/UCRQi7lPBY1SngaqXV1UdTCg`)
                    break

                case "instagram":
                case "ig":
                    TheBoom_Bot.say(`Instagram page: https://www.instagram.com/thomasnottom_/`)
                    break

                case "tiktok":
                case "tt":
                    TheBoom_Bot.say(`TikTok page: https://www.ti
                    ktok.com/@thomasnottom_?`)
                    break

                case "test":
                    TheBoom_Bot.say("This is a test command :D")
                    break

                case "lurk":
                    TheBoom_Bot.say(`${tags["username"]} is now lurking`)
                    break

                case "points":
                    TheBoom_Bot.say(`${tags["username"]} has ${PointsManager.getUserData(tags["username"])["points"]} points`)
                    break

                case "leaderboard":
                    console.log("hmm")
                    if (COMMAND_TIMEOUTS["leaderboard"] === false) {
                        console.log("agh ")
                        const leaderboard = UserManager.getAllUsersByPoints()
                        for (let i = 0 ; i < 5 ; i ++) {
                            if (leaderboard[i] === undefined) {break}
                            TheBoom_Bot.say(`(${i}) - ${leaderboard[i][0]} has ${leaderboard[i][1]} points`)
                        }
                        COMMAND_TIMEOUTS["leaderboard"] = true
                        setTimeout(() => {
                            COMMAND_TIMEOUTS["leaderboard"] = false
                            console.log("timeout over")
                        }, 1)

                    } else {
                        console.log("ahh")


                        TheBoom_Bot.say(`${tags["username"]} the leaderboard is on cooldown`)
                    }
            }
        }
    }
}