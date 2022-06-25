module.exports = {
  helpf: '(phrase | target | source)',
  desc: 'Translates the phrase inside the function from source to target, otherwise auto.',
  func: async function (matches) {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var target = split[1] ?? 'en'
    var source = split[2] ?? ''

    if (poopy.vars.languages.find(language => (language.language.toLowerCase() === target.toLowerCase()) || (language.name.toLowerCase() === target.toLowerCase()))) {
      target = poopy.vars.languages.find(language => (language.language.toLowerCase() === target.toLowerCase()) || (language.name.toLowerCase() === target.toLowerCase())).language
    } else {
      target = 'en'
    }

    if (poopy.vars.languages.find(language => (language.language.toLowerCase() === source.toLowerCase()) || (language.name.toLowerCase() === source.toLowerCase()))) {
      source = poopy.vars.languages.find(language => (language.language.toLowerCase() === source.toLowerCase()) || (language.name.toLowerCase() === source.toLowerCase())).language
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
        'x-rapidapi-key': poopy.functions.randomKey('RAPIDAPIKEY')
      },
      data: [{ Text: phrase }]
    };

    var response = await poopy.modules.axios.request(options).catch(() => { })

    if (response) {
      return response.data[0].translations[0].text
    }

    return phrase
  },
  attemptvalue: 10,
  limit: 5
}