const fs = require("fs")

module.exports = class FileManager {
    static readJSON(fileName) {
        return fs.readFileSync(fileName).toString()
    }
    static loadJSON(filename) {
        return JSON.parse(FileManager.readJSON(filename))
    }

    static saveJSON(filename, data) {
        fs.writeFileSync(filename, JSON.stringify(data))
    }
}