module.exports = {
  name: ['araboword', 'raleighword'],
  execute: async function (msg) {
    let poopy = this

    var vowels = ['a', 'e', 'i', 'o', 'u']
    var consonants = []
    for (i = 97; i <= 122; i++) {
      var char = String.fromCharCode(i)
      if (!vowels.find(letter => letter == char)) {
        consonants.push(char)
      }
    }
    var word = ''
    for (i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
      word += consonants[Math.floor(Math.random() * consonants.length)] + vowels[Math.floor(Math.random() * vowels.length)]
    }
    msg.channel.send(word).catch(() => { })
  },
  help: {
    name: 'araboword/raleighword',
    value: "Generates a completely nonsensical word that doesn't even exist."
  },
  cooldown: 2500,
  type: 'Text'
}