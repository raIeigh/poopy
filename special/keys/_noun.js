module.exports = {
    desc: 'Returns a random noun.', func: async function () {
        let poopy = this

        var nounJSON = poopy.json.nounJSON
        return nounJSON.data[Math.floor(Math.random() * nounJSON.data.length)].noun
    }
}