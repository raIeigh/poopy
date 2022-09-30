module.exports = {
    helpf: '(phrase | languages | target | source)',
    desc: 'Badly translates the phrase inside the function from source to target. You can specify how many languages it goes through.',
    func: async function (matches, msg) {
      let poopy = this
      let { splitKeyFunc, userToken } = poopy.functions
      let vars = poopy.vars
      let { axios } = poopy.modules
  
      var word = matches[1]
      var split = splitKeyFunc(word, { args: 4 })
      var phrase = split[0] ?? ''
      var languagesindex = split[1] ?? 5
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

      var repeat = 5
        if (languagesindex > -1) {
            repeat = isNaN(Number(args[languagesindex + 1])) ? 5 : Number(args[languagesindex + 1]) <= 2 ? 2 : Number(args[languagesindex + 1]) >= 25 ? 25 : Math.round(Number(args[languagesindex + 1])) || 5
            args.splice(languagesindex, 2)
        }
  
        var output = phrase
        var lastlanguage = source
        var currentlanguage = vars.languages[Math.floor(Math.random() * vars.languages.length)].language

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

            var response = await axios.request(options).catch(async () => {
                return "Error."
            })

            if (!response) {
                return "Error."
            }

            output = response.data[0].translations[0].text
            lastlanguage = currentlanguage
            currentlanguage = i == repeat - 2 ? target : vars.languages[Math.floor(Math.random() * vars.languages.length)].language
        }

        if (output) {
            return output
        }
  
      return phrase
    },
    attemptvalue: 10,
    limit: 5
  }
