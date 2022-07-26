module.exports = {
  helpf: '(seconds)',
  desc: 'Waits the specified seconds. Maximum is 60.',
  func: async function (matches, msg) {
    let poopy = this

    var word = matches[1]
    var waitTime = Math.min(Math.max(Number(word), 0), 60)
    poopy.tempdata[msg.author.id][msg.id]['keyattempts'] += !isNaN(waitTime) ? waitTime : 0
    await poopy.functions.sleep(waitTime * 1000)
    return ''
  }
}