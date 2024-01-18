module.exports = {
  helpf: '(phrase | target | source)',
  desc: 'Translates the phrase inside the function from source to target, otherwise auto.',
  func: async function (matches, msg) {
    let poopy = this
    let { splitKeyFunc, userToken } = poopy.functions
    let vars = poopy.vars
    let { axios } = poopy.modules

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var target = split[1] ?? 'en'
    var source = split[2] ?? 'auto'

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

    var options = {
      method: 'GET',
      url: "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
        client: "gtx",
        sl: source,
        tl: target,
        dt: "t",
        dj: "1",
        source: "input",
        q: saidMessage
      })
    };

    var response = await axios(options).catch(() => { })

    if (response) {
      return response.data.sentences.
        map(s => s?.trans).
        filter(Boolean).
        join("")
    }

    return phrase
  },
  attemptvalue: 10,
  limit: 5,
  cmdconnected: ['translate']
}