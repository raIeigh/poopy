module.exports = {
    desc: 'Returns a random white Cards Against Humanity phrase.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var cahJSON = json.cahJSON
        return cahJSON.white[Math.floor(Math.random() * cahJSON.white.length)]
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var cahJSON = json.cahJSON
        return cahJSON.white
    }
}
