module.exports = {
    desc: 'Returns a random adjective.', func: function () {
        let poopy = this

        var adjJSON = poopy.json.adjJSON
        return adjJSON.data[Math.floor(Math.random() * adjJSON.data.length)].adjective
    }
}