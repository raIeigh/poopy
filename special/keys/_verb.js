module.exports = {
    desc: 'Returns a random verb.', func: function () {
        let poopy = this
        let json = poopy.json

        var verbJSON = json.verbJSON
        return verbJSON.data[Math.floor(Math.random() * verbJSON.data.length)].verb
    }
}