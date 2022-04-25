module.exports = {
  desc: "Returns a random word from the arabottify command's dictionary.",
  func: async function () {
    let poopy = this

    return poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)]
  }
}