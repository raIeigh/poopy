module.exports = {
  helpf: '(pick1 | pick2 | pick3)',
  desc: 'Returns a random black Cards Against Humanity phrase. The blank spaces will be filled with the picks.',
  func: async function (matches) {
    let poopy = this
    let json = poopy.json
    let { splitKeyFunc } = poopy.functions

    var word = matches[1]
    var split = splitKeyFunc(word)

    var cahJSON = json.cahJSON
    var black = cahJSON.black[Math.floor(Math.random() * cahJSON.black.length)]

    var phrase = black.text

    if (split.length && split[0]) {
      if (phrase.match(/_/)) {
        var i = 0
        phrase = phrase.replace(/_/g, () => {
          i++
          return split[(i - 1) % split.length]
        })
      } else {
        for (var i = 0; i < black.pick; i++) {
          phrase += `${i > 0 ? "\n" : " "}${split[i % split.length]}`
        }
      }
    }

    return phrase
  }
}