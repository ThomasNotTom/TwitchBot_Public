const FileManager = require("./FileManager");

var TheBoom_Bot = null

userBlank = {
    "points": 0
}

__data = FileManager.loadJSON("./Data/pointsData.json")

class UserManager {
    static init(BOT) {
        TheBoom_Bot = BOT
    }

    static isUser(name) {
        return __data["data"][name.lower] !== undefined
    }

    static createUser(name) {
        __data["data"][name.lower] = userBlank
        TheBoom_Bot.say(`Creating a profile for ${name}`)
        this.update()
        return userBlank
    }

    static getUserData(name) {
        if (UserManager.isUser(name)) {
            return __data["data"][name.lower]
        } else {
            return UserManager.createUser(name)
        }
    }

    static getAllUsersByPoints() {
        {
            let currentData = {}
            for (var user in __data["data"]) {
                currentData[user] = __data["data"][user]
            }

            var newData = []
            var sorted = false
            while (sorted === false) {
                var change = false
                var highestUser = []
                for (let user in currentData) {
                    if (highestUser.length === 0 || currentData[user]["points"] > highestUser[1]) {
                        highestUser = [user, currentData[user]["points"]]
                        change = true
                    }
                }
                if (change === false) {
                    sorted = true
                } else {
                    delete currentData[highestUser[0]]
                    newData.push(highestUser)
                }
            }
            return newData
        }
    }

    static setUserPoints(name, points) {
        if (UserManager.isUser(name) === false) {
            UserManager.createUser(name)
        }
        this.getUserData(name)["points"] = points
        this.update()
    }

    static addUserPoints(name, deltaPoints, sendMessage) {
        if (UserManager.isUser(name) === false) {
            UserManager.createUser(name)
        }
        this.getUserData(name)["points"] += deltaPoints
        this.update()
        if (sendMessage === undefined) { sendMessage = true }
        if (sendMessage) {
            TheBoom_Bot.say(`${name} has gained ${deltaPoints} and now has ${this.getUserData(name)["points"]} points`)
        }
    }

    static update() {
        FileManager.saveJSON("./Data/pointsData.json", __data)
    }
}
module.exports = UserManager