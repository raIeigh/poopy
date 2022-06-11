module.exports = {
    helpf: '(phrase)',
    desc: "Ends the keyword collection and returns the phrase, except keywords and functions aren't executed.",
    func: function (matches, msg) {
        let poopy = this

        var word = matches[1]
        poopy.tempdata[msg.author.id][msg.id]['return'] = word

        return ''
    },
    raw: true
}