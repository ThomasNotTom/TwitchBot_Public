const {SECRETS} = require("./SECRETS");
const tmi = require("tmi.js")

const CHANNEL = "thomasnottom_"

class Bot {
    constructor(username, oauthToken, debug) {
        this.__NAME = "Gerald"

        this.__client = new tmi.Client({
            options: {debug: debug},
            identity: {
                username,
                password: "oauth:" + oauthToken
            },
            channels: ["ThomasNotTom_", "TheBoom_Bot"]
        })
    }

    async connect() {
        await this.__client.connect()
        this.__client.on("message", require("./Handlers/MessageHandler").handle)
        this.__client.on("cheer", require("./Handlers/CheerHandler").handle)
        return this
    }

    getName() { return this.__NAME }

    say(message) {
        this.__client.say(CHANNEL, message)
    }

    deleteMessage(msgID) {
        return this.__client.deletemessage(CHANNEL, msgID)
    }

    whisper(user, msg) {
        return this.__client.whisper(user, msg)
    }
}
const BOT = new Bot("theboom_bot", SECRETS.Bot.Bearer, true)
module.exports = BOT