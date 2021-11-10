const {SECRETS} = require("./SECRETS");

const got = require("got")

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

const express = require("express")
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var TheBoom_Bot = null
module.exports["init"] = function init(BOT) {
    TheBoom_Bot = BOT
}
const UserManager = require("./Managers/UserManager")
const RewardHandler = require("./Handlers/RewardHandler")
const NotificationManager = require("./Managers/NotificationManager");

var isOnline = null

app.listen(process.env.PORT || 8000)

app.get("/main", (req, res) => {
    res.send("HELLO")
})

// https://id.twitch.tv/oauth2/authorize
//     ?client_id=4ln2xqirm7a0d1ta47df3nvzydgpl6
//         &redirect_uri=https://thomasnottom-bots.herokuapp.com/authorize
//         &response_type=code
//         &scope=channel:manage:redemptions

// https://id.twitch.tv/oauth2/authorize?client_id=4ln2xqirm7a0d1ta47df3nvzydgpl6&redirect_uri=https://thomasnottom-bots.herokuapp.com/authorize&response_type=code&scope=channel:read:subscriptions

app.get("/authorize", (req, res) => {
    const code = req.query["code"]
    var xhttp = new XMLHttpRequest()
    xhttp.open("post", "https://id.twitch.tv/oauth2/token?client_id=" + SECRETS.Client.ID + "&" +
        "client_secret=" + SECRETS.Client.Secret + "&" +
        "code=" + code + "&" +
        "grant_type=authorization_code")
    xhttp.send()
    res.send(code)
})

var new_followers = []

app.post("/follow", (req, res) => {
    const event = req.body["event"]

    if (req.body["challenge"] !== undefined) {
        res.send(req.body["challenge"])
    } else {
        if (new_followers.findIndex((i) => {return i === event["user_name"]}) === -1) {
            TheBoom_Bot.say("Thank you " + event["user_name"] + ", for the follow!")
            UserManager.addUserPoints(event["user_name"], 50)

            NotificationManager.addFollow(event["user_name"])

            res.status(200)
            res.send()

            new_followers.push(event["user_name"])
        }
        res.status(200)
        res.send()
    }
})

app.post("/online", (req, res) => {
    if (req.body["challenge"] !== undefined) {
        res.send(req.body["challenge"])
    } else {
        TheBoom_Bot.say("We are online ;)")
        isOnline = true
        res.status(200)
        res.send()
    }
})

app.post("/offline", (req, res) => {
    if (req.body["challenge"] !== undefined) {
        console.log("authorised")
        res.send(req.body["challenge"])
    } else {
        TheBoom_Bot.say("Goodbye!")
        isOnline = false
        res.status(200)
        res.send()
    }
})

app.post("/channel_points_redeemed", (req, res) => {
    if (req.body["challenge"] !== undefined) {
        console.log("authorised")
        res.send(req.body["challenge"])
    } else {
        RewardHandler.handle(req.body["event"]["user_name"], req.body["event"]["reward"]["id"])
        res.status(200)
        res.send()
    }
})

app.post("/subscribe", (req, res) => {
    if (req.body["challenge"] !== undefined) {
        console.log("authorised")
        res.send(req.body["challenge"])
    } else {
        const event = req.body["event"]
        var tier
        switch (event["tier"]) {
            case "1000":
                tier = 1
                break

            case "2000":
                tier = 2
                break

            case "3000":
                tier = 3
                break

            default:
                tier = event["tier"]
        }
        if (event["is_gift"]) {
            TheBoom_Bot.say(`${event["user_name"]} was gifted a tier ${tier} subscription`)
        } else {
            TheBoom_Bot.say(`Thank you ${event["user_name"]} for the tier ${tier} subscription`)
            UserManager.addUserPoints(event["user_name"], tier * 200)

        }
        res.status(200)
        res.send()
    }
})

app.post("/subscribe_gift", (req, res) => {
    if (req.body["challenge"] !== undefined) {
        console.log("authorised")
        res.send(req.body["challenge"])
    } else {
        const event = req.body["event"]
        var tier
        switch (event["tier"]) {
            case "1000":
                tier = 1
                break

            case "2000":
                tier = 2
                break

            case "3000":
                tier = 3
                break

            default:
                tier = event["tier"]
        }
        if (event["is_anonymous"] === false) {
            TheBoom_Bot.say(`${event["user_name"]} has gifted ${event["total"]} tier ${tier} subscriptions`)
        } else {
            TheBoom_Bot.say(`Someone has gifted ${event["total"]} tier ${tier} subscriptions`)
        }
        res.status(200)
        res.send()
    }
})

app.post("/raid", (req, res) => {
    if (req.body["challenge"] !== undefined) {
        console.log("authorised")
        res.send(req.body["challenge"])
    } else {
        const event = req.body["event"]

        TheBoom_Bot.say(`${event["from_broadcaster_user_name"]} is raiding with ${event["viewers"]}`)

        res.status(200)
        res.send()
    }
})
var notificationRecievers = []
module.exports["getNotificationRecievers"] = function () {
    return notificationRecievers
}
module.exports["clearNotificationRecievers"] = function () {
    notificationRecievers = []
}
app.post("/notificationReciever", (req, res) => {
    notificationRecievers.push(res)
})

function sendWebhookAttempt(data) {
    var xhttp = new XMLHttpRequest()
    xhttp.open("post", "https://api.twitch.tv/helix/eventsub/subscriptions")
    xhttp.setRequestHeader("Client-ID", SECRETS.Client.ID)
    xhttp.setRequestHeader("Authorization", "Bearer " + SECRETS.Client.bearer_access_token)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            console.log(data["type"] + " : " + xhttp.responseText)
        }
    }
    xhttp.send(JSON.stringify(data))
}

async function update_bearer_access_token() {
    await got.post("https://id.twitch.tv/oauth2/token", {
        searchParams: {
            client_id: SECRETS.Client.ID,
            client_secret: SECRETS.Client.Secret,
            grant_type: "client_credentials"
        },
        responseType: "json"
    }).then((response) => {
        console.log(response["body"])
        SECRETS.Client.bearer_access_token = response["body"]["access_token"]
    }).catch((r) => {
        console.log("Error in update_bearer_access_token()")
        console.log(r)
    })
}
update_bearer_access_token()
    .then(() => {
        sendWebhookAttempt({
            "version": 1,
            "type": "channel.follow",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/follow",
                "secret": "abcdefghij0123456789"
            }
        })
        sendWebhookAttempt({
            "version": 1,
            "type": "stream.online",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/online",
                "secret": "abcdefghij0123456789"
            }
        })

        sendWebhookAttempt({
            "version": 1,
            "type": "stream.offline",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/offline",
                "secret": "abcdefghij0123456789"
            }
        })

        sendWebhookAttempt({
            "version": 1,
            "type": "channel.channel_points_custom_reward_redemption.add",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/channel_points_redeemed",
                "secret": "abcdefghij0123456789"
            }
        })
        sendWebhookAttempt({
            "version": 1,
            "type": "channel.subscribe",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/subscribe",
                "secret": "abcdefghij0123456789"
            }
        })
        sendWebhookAttempt({
            "version": 1,
            "type": "channel.subscribe.gift",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/subscribe_gift",
                "secret": "abcdefghij0123456789"
            }
        })
        sendWebhookAttempt({
            "version": 1,
            "type": "channel.raid",
            "condition": {
                "broadcaster_user_id": "101475659"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://thomasnottom-bots.herokuapp.com/raid",
                "secret": "abcdefghij0123456789"
            }
        })
    })
