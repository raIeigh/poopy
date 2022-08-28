module.exports = {
  desc: "Returns a random word from the arabottify command's dictionary.",
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.arabDictionary[Math.floor(Math.random() * arrays.arabDictionary.length)]
  }
}