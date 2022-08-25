const axios = require('axios')

var dataGotten = {}
var dataGetting = {}

var dataGetters = {
    codeLanguages: async function () {
        var clresponse = await axios.get('https://wandbox.org/api/list.json').catch(() => { })

        if (clresponse) {
            return clresponse.data.filter((lang, index, self) => self.findIndex(l => l.templates[0] === lang.templates[0]) === index).sort((a, b) => {
                if (a.templates[0] < b.templates[0]) return -1
                if (a.templates[0] > b.templates[0]) return 1
                return 0
            })
        }
    },
    
    languages: async function () {
        var lresponse = await poopy.modules.axios.request({
            method: 'GET',
            url: 'https://microsoft-translator-text.p.rapidapi.com/languages',
            params: { 'api-version': '3.0' },
            headers: {
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
            }
        }).catch(() => { })

        if (lresponse) return Object.keys(lresponse.data.translation).map(lang => {
            return { ...lresponse.data.translation[lang], language: lang }
        })
    },
    
    uberduck: async function () {
        var voiceResponse = await poopy.modules.axios.request({
            method: 'GET',
            url: 'https://api.uberduck.ai/voices?mode=tts-basic',
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${btoa(`${process.env.UBERDUCKKEY}:${process.env.UBERDUCKSECRET}`)}`
            }
        }).catch(() => { })

        if (voiceResponse) {
            var voices = voiceResponse.data.sort((va, vb) => {
                var x = va.display_name.toLowerCase()
                var y = vb.display_name.toLowerCase()
                if (x < y) return -1
                if (x > y) return 1
                return 0
            })

            var categories = []
            for (var i in voices) {
                var voice = voices[i]

                if (!categories.find(category => category.name == voice.category)) categories.push({ name: voice.category, voices: [] })
                categories.find(category => category.name == voice.category).voices.push(voice)
            }
            categories.sort((ca, cb) => {
                var x = ca.name.toLowerCase()
                var y = cb.name.toLowerCase()
                if (x < y) return -1
                if (x > y) return 1
                return 0
            })

            return [voices, categories]
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

for (var name in dataGetters) {
    var dataGet = dataGetters[name]
    dataGetters[name] = async function () {
        while (dataGetting[name]) await sleep()
        if (dataGotten[name]) return dataGotten[name]

        dataGetting[name] = true
        var result = await dataGet().catch(() => { })

        if (result) dataGotten[name] = result
        delete dataGetting[name]

        return result
    }
}

module.exports = dataGetters