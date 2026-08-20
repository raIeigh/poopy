module.exports = {
  desc: 'doopley image',
  func: function () {
    let poopy = this
    let json = poopy.json
    let { randomChoice } = poopy.functions

    return `https://assetdelivery.vercel.app/${randomChoice(json.doopleyJSON.images)}.png`
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    return json.doopleyJSON.images
  },
  cmdconnected: 'doopley'
}
