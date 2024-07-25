module.exports = {
    desc: 'Returns a random black Cards Against Humanity phrase.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var cahJSON = json.cahJSON
        return cahJSON.black[Math.floor(Math.random() * cahJSON.black.length)].text
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var cahJSON = json.cahJSON
        return cahJSON.black.map(b => b.text)
    }
}
