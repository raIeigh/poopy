module.exports = {
  desc: `Returns a random word from the arabottify command's dictionary, except it doesn't include words like "sex" or "penis".`,
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.tenorDictionary[Math.floor(Math.random() * arrays.tenorDictionary.length)]
  }
}