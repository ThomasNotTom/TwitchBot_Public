const CommandHandler = require("./CommandHandler")
const SwearScanner = require("./SwearScanner");
const RewardHandler = require("./RewardHandler");

var TheBoom_Bot = null

module.exports = class MessageHandler {
    static init(BOT) {
        TheBoom_Bot = BOT
    }

    static handle(channel, tags, message, self) {
        if (self) {
            return false
        }

        console.log(tags["user-id"])

        const phrase = message.replace(" ", "")
        const inappropriateWord = SwearScanner.containsBlockedWord(phrase)

        if (inappropriateWord !== false) {
            TheBoom_Bot.deleteMessage(tags["id"])
                .catch(() => {
                    console.log(`Cannot remove ${tags["username"]} message`)
                })
            TheBoom_Bot.whisper(tags["username"], `The word '${inappropriateWord}' cannot be used in chat`)
                .catch(() => {
                    console.log(`Cannot whisper to ${tags["username"]}`)
                })
            return false
        }

        if (tags["custom-reward-id"] !== undefined) {
            RewardHandler.handleText(channel, tags, message)
        } else {
            CommandHandler.handle(channel, tags, message)
        }
    }
}