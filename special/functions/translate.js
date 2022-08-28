module.exports = {
  helpf: '(phrase | target | source)',
  desc: 'Translates the phrase inside the function from source to target, otherwise auto.',
  func: async function (matches) {
    let poopy = this
    let { splitKeyFunc, randomKey } = poopy.functions
    let vars = poopy.vars
    let { axios } = poopy.modules

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var target = split[1] ?? 'en'
    var source = split[2] ?? ''

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

    var options = {
      method: 'POST',
      url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
      params: { from: source || null, to: target, 'api-version': '3.0', profanityAction: 'NoAction', textType: 'plain' },
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
        'x-rapidapi-key': randomKey('RAPIDAPI_KEY')
      },
      data: [{ Text: phrase }]
    };

    var response = await axios.request(options).catch(() => { })

    if (response) {
      return response.data[0].translations[0].text
    }

    return phrase
  },
  attemptvalue: 10,
  limit: 5
}