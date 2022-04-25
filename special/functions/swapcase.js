module.exports = {
    helpf: '(phrase)',
    desc: 'sWAPS ALL THE CASES IN THE PHRASE INSIDE THE FUNCTION!',
    func: async (matches) => {
        let poopy = this

        var word = matches[1]
        var swapword = ''
        for (var i = 0; i < word.length; i++) {
            if (word[i] === word[i].toLowerCase()) {
                swapword += word[i].toUpperCase()
            } else {
                swapword += word[i].toLowerCase()
            }
        }
        return swapword
    }
}