const Server = require("./Server")

const TheBoom_Bot = require("./Bot")

const MessageHandler = require("./Handlers/MessageHandler");
const CommandHandler = require("./Handlers/CommandHandler");
const CheerHandler = require("./Handlers/CheerHandler");

const UserManager = require("./Managers/UserManager");
const NotificationManager = require("./Managers/NotificationManager");

TheBoom_Bot.connect()
.then(() => {
    MessageHandler.init(TheBoom_Bot)
    CommandHandler.init(TheBoom_Bot)
    CheerHandler.init(TheBoom_Bot)
    UserManager.init(TheBoom_Bot)
    NotificationManager.init()

    Server.init(TheBoom_Bot)
})