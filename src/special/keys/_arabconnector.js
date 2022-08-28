module.exports = {
  desc: "Returns a random connector from the arabottify command's connector dictionary.",
  func: function () {
    let poopy = this
    let arrays = poopy.arrays

    return arrays.arabConnectors[Math.floor(Math.random() * arrays.arabConnectors.length)]
  }
}