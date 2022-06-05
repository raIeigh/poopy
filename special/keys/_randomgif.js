module.exports = {
    desc: 'Returns a random Tenor gif.',
    func: function (msg) {
        let poopy = this

        return new Promise(resolve => {
            function getWord() {
                var word = poopy.arrays.tenorDictionary[Math.floor(Math.random() * poopy.arrays.tenorDictionary.length)]
                if (!word) {
                    return getWord()
                }
                return word.toLowerCase()
            }

            poopy.modules.axios.get(`https://g.tenor.com/v1/search?q=${encodeURIComponent(getWord())}&key=${process.env.TENORKEY}&limit=100&contentfilter=${msg.channel.nsfw ? 'off' : 'medium'}`).then((res) => {
                var parsedBody = res.data
                if (parsedBody.results) {
                    if (parsedBody.results[0]) {
                        resolve(parsedBody.results[Math.floor(Math.random() * parsedBody.results.length)].itemurl)
                    } else {
                        resolve('Error while fetching GIFs.')
                    }
                } else {
                    resolve('Error while fetching GIFs.')
                }
            })
        })
    },
    attemptvalue: 2
}