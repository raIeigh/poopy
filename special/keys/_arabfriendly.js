module.exports = {
  desc: `Returns a random word from the arabottify command's dictionary, except it doesn't include words like "sex" or "penis".`,
  func: function () {
    let poopy = this

    return poopy.arrays.tenorDictionary[Math.floor(Math.random() * poopy.arrays.tenorDictionary.length)]
  }
}