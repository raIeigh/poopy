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
    var repeat = parseNumber(split[1] ?? 5, { min: 2, max: 250, dft: 5, round: true })
    var target = split[2] ?? 'en'
    var source = split[3] ?? 'auto'

    if (Object.entries(vars.languages).find(language => language[0] == target.toLowerCase() || language[1] == target.toLowerCase())) {
      target = Object.entries(vars.languages).find(language => language[0] == target.toLowerCase() || language[1] == target.toLowerCase())[0]
    } else {
      target == 'en'
    }

    if (Object.entries(vars.languages).find(language => language[0] == source.toLowerCase() || language[1] == source.toLowerCase())) {
      source = Object.entries(vars.languages).find(language => language[0] == source.toLowerCase() || language[1] == source.toLowerCase())[0]
    } else {
      source == 'auto'
    }

    var output = phrase
    var lastlanguage = source
    var currentlanguage = randomChoice(Object.keys(vars.languages))

    for (var i = 0; i < repeat; i++) {
      var options = {
        method: 'GET',
        url: "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
          client: "gtx",
          sl: lastlanguage,
          tl: currentlanguage,
          dt: "t",
          dj: "1",
          source: "input",
          q: output
        })
      };

      var response = await axios(options).catch(() => { })

      if (!response) return word

      output = response.data.sentences.
        map(s => s?.trans).
        filter(Boolean).
        join("")
      lastlanguage = currentlanguage
      currentlanguage = i == repeat - 2 ? target : randomChoice(Object.keys(vars.languages))
    }

    if (output) return output

    return word
  },
  attemptvalue: 10,
  limit: 5,
  cmdconnected: ['badtranslate']
}
