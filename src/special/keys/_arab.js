module.exports = {
  desc: "Returns a random word from the arabottify command's dictionary.",
  func: function () {
    let poopy = this
    let json = poopy.json

    return json.arabJSON.words[Math.floor(Math.random() * json.arabJSON.words.length)]
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.arabJSON.words
  }
}