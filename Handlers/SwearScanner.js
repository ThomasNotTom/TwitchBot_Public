const BlockedWords = require("./Swears")

const replacers = {
    "a": "a4",
    "b": "b4",
    "c": "c2",
    "d": "d4",
    "e": "e3£€$",
    "f": "f4",
    "g": "gq46",
    "h": "h4",
    "i": "i1|!",
    "j": "j",
    "k": "k",
    "l": "l1|!",
    "m": "m",
    "n": "nh",
    "o": "o0@",
    "p": "p49",
    "q": "q9",
    "r": "r£",
    "s": "s5£$€",
    "t": "t1|!",
    "u": "u",
    "v": "v",
    "w": "w",
    "x": "xw",
    "y": "y7",
    "z": "z7"
}

const words = BlockedWords;

const globalRegex = "+" //Repeaat same leter

var regdWords = {}

for (var word in words) {
    var regdLetters = "";
    for (var letter in words[word]) {
        regdLetters += "["+ replacers[words[word][letter]] + "]" + globalRegex;
    }
    regdWords[words[word]] = new RegExp(regdLetters, "i");
}

module.exports = class SwearScanner {
    static containsBlockedWord(phrase) {
        for (var regex in regdWords) {
            if(phrase.match(regdWords[regex]) !== null) {
                return regex;
            }
        }
        return false;
    }
}