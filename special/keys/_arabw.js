module.exports = {
    desc: "Returns a completely nonsensical word that doesn't even exist.",
    func: async () => {
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
        return word
    }
}