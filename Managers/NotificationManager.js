var Server = null

var notifications = {
    events: {
        followers: [],
        bitDonations: [],
        anonBitDonations: [],
        subscriptions: [],
        raids: []
    }
}

class NotificationManager {
    static init() {
        setInterval(() => {
            var isChanged = false

            for (const event in notifications.events) {
                if (notifications.events[event].length > 0) {
                    isChanged = true
                    break
                }
            }
            if (isChanged) {
                var notifs = require("../Server").getNotificationRecievers()
                for (var webhook in notifs) {
                    notifs[webhook].header("Access-Control-Allow-Origin", "*")
                    notifs[webhook].send(notifications)
                }
                NotificationManager.clearNotifications()
                require("../Server").clearNotificationRecievers()
            }
        }, 1000)
    }

    static addFollow(name) {
        console.log("new follow")
        notifications.events.followers.push({
            name: name
        })
    }

    static addBitDonation(name, donationAmount) {
        notifications.events.bitDonations.push({
            name: name,
            donationAmount: donationAmount
        })
    }

    static addAnonBitDonations(donationAmount) {
        notifications.events.anonBitDonations.push({
            donationAmount: donationAmount
        })
    }
    static addSubscription(name, tier) {
        notifications.events.subscriptions.push({
            name: name,
            tier: tier
        })
    }

    static addRaid(raider, viewers) {
        notifications.events.raids.push({
            name: name,
            viewers: viewers
        })
    }

    static clearNotifications() {
        for (var dataSet in notifications.events) {
            notifications.events[dataSet] = []
        }
    }
}
module.exports = NotificationManager