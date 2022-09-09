module.exports = {
  desc: `Returns a random word from the arabottify command's dictionary, except it doesn't include words like "sex" or "penis".`,
  func: function () {
    let poopy = this
    let arrays = poopy.arrays
    let { randomChoice } = poopy.functions

    return randomChoice(arrays.arabDictionary.filter(arab => !arrays.arabDanger.includes(arab)))
  }
}