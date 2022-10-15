module.exports = {
    helpf: '(phrase | languages | target | source)',
    desc: 'Badly translates the phrase inside the function from source to target. You can specify how many languages it goes through.',
    func: async function (matches, msg) {
      let poopy = this
      let { splitKeyFunc, parseNumber, randomChoice, userToken } = poopy.functions
      let vars = poopy.vars
      let { axios } = poopy.modules
  
      var word = matches[1]
      var split = splitKeyFunc(word, { args: 4 })
      var phrase = split[0] ?? ''
      var repeat = parseNumber(split[1] ?? 5, { min: 2, max: 25, dft: 5, round: true })
      var target = split[2] ?? 'en'
      var source = split[3] ?? ''
  
      if (vars.languages.find(language => (language.language.toLowerCase() === target.toLowerCase()) || (language.name.toLowerCase() === target.toLowerCase()))) {
        target = vars.languages.find(language => (language.language.toLowerCase() === target.toLowerCase()) || (language.name.toLowerCase() === target.toLowerCase())).language
      } else {
        target = 'en'
      }
  
      if (vars.languages.find(language => (language.language.toLowerCase() === source.toLowerCase()) || (language.name.toLowerCase() === source.toLowerCase()))) {
        source = vars.languages.find(language => (language.language.toLowerCase() === source.toLowerCase()) || (language.name.toLowerCase() === source.toLowerCase())).language
      } else {
        source = ''
      }

        var maxlength = Math.round(2000 / repeat)
        if (phrase.length > maxlength) return `The input length must be smaller or equal to 2000 divided by the number of repetitions. (in this case ${maxlength} characters)`

        var output = phrase
        var lastlanguage = source
        var currentlanguage = randomChoice(vars.languages).language

        for (var i = 0; i < repeat; i++) {
            var options = {
                method: 'POST',
                url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
                params: { from: lastlanguage, to: currentlanguage, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain' },
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                    'x-rapidapi-key': userToken(msg.author.id, 'RAPIDAPI_KEY')
                },
                data: [{ Text: output }]
            };

            var response = await axios.request(options).catch(() => { })

            if (!response) return word

            output = response.data[0].translations[0].text
            lastlanguage = currentlanguage
            currentlanguage = i == repeat - 2 ? target : randomChoice(vars.languages).language
        }

        if (output) return output
  
      return word
    },
    attemptvalue: 10,
    limit: 5,
    envRequired: ['RAPIDAPI_KEY'],
    cmdconnected: ['badtranslate']
  }
