module.exports = {
  desc: "Returns a random word from the arabottify command's dictionary.",
  func: function () {
    let poopy = this

    return poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)]
  }
}