module.exports = {
    desc: 'Returns a random adjective.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var adjJSON = json.adjJSON
        return adjJSON.data[Math.floor(Math.random() * adjJSON.data.length)].adjective
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var adjJSON = json.adjJSON
        return adjJSON.data.map(a => a.adjective)
    }
}