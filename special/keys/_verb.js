module.exports = {
    desc: 'Returns a random verb.', func: function () {
        let poopy = this

        var verbJSON = poopy.json.verbJSON
        return verbJSON.data[Math.floor(Math.random() * verbJSON.data.length)].verb
    }
}