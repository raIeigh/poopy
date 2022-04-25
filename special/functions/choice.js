module.exports = {
  helpf: '(choice1 | choice2 | choice3 | etc...)',
  desc: 'Chooses a random option out of the options inside the phrase. Each option should be separated by "|".',
  func: async (matches) => {
    let poopy = this

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    return split[Math.floor(Math.random() * split.length)]
  },
  raw: true
}