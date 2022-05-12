module.exports = {
    helpf: '(phrase)',
    desc: 'Ends the keyword collection and returns the phrase.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]
        poopy.tempdata[msg.author.id]['return'] = word

        return ''
    }
}