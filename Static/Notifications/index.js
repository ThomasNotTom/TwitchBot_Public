function onFollow() {}

window.onload = async () => {
    var running = true
    while (running) {
        await new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest()
            xhttp.open("post", "http://localhost:8000/notificationReciever")
            xhttp.send()
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    resolve(xhttp.responseText)
                }
            }
        }).then((response) => {
            console.log(response)
        })
    }
}